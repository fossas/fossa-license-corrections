const fs = require('fs');
const axios = require('axios');
const csv = require('csv-parser');

// Get FOSSA API key from command-line arguments
const apiKey = process.argv[3];

if (!apiKey) {
  console.error('FOSSA API key not provided. Please provide it as a command-line argument.');
  process.exit(1);
}

// Replace with the base URL for FOSSA API
const fossaApiBaseUrl = 'https://app.fossa.com/api';

const csvFilePath = process.argv[2];
const packageMap = new Map(); // Map to store package data

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', async (row) => {
    const {
      'fossa-dependency-locator': dependencyLocator,
      'fossa-fetcher-type': fetcherType,
      'fossa-license-grouping': licenseGrouping,
      'linked-grouping-id': linkedGroupingId,
      'corrected-license-id': correctedLicenseId,
      'corrected-license-text': correctedLicenseTextPath,
      'package-url': packageUrl,
    } = row;

    const packageKey = `${dependencyLocator}_${fetcherType}`;

    if (!packageMap.has(packageKey)) {
      packageMap.set(packageKey, {
        packageUrl: packageUrl,
        licenses: [],
        linkedLicenses: new Map(),
      });
    }

    const packageData = packageMap.get(packageKey);
    const licenseContent = fs.readFileSync(correctedLicenseTextPath, 'utf-8');

    if (licenseGrouping === 'separate-grouping') {
      packageData.licenses.push([{ licenseId: correctedLicenseId, text: licenseContent }]);
    } else if (licenseGrouping === 'linked-grouping') {
      if (linkedGroupingId) {
        const linkedGroupingKey = `${linkedGroupingId}`;
        if (!packageData.linkedLicenses.has(linkedGroupingKey)) {
          packageData.linkedLicenses.set(linkedGroupingKey, []);
        }
        packageData.linkedLicenses.get(linkedGroupingKey).push({ licenseId: correctedLicenseId, text: licenseContent });
      } else {
        throw new Error(`Linked-grouping entry for ${dependencyLocator} (${fetcherType}) is missing linked-grouping-id`);
      }
    }

    packageMap.set(packageKey, packageData);
  })
  .on('end', async () => {
    for (const [packageKey, packageData] of packageMap.entries()) {
      const [dependencyLocator, fetcherType] = packageKey.split('_');
      const requestUrl = `${fossaApiBaseUrl}/projects/${encodeURIComponent(fetcherType)}%2B${encodeURIComponent(dependencyLocator)}/correction`;

      const requestData = {
        project: {
          url: packageData.packageUrl,
        },
        licenses: [
          ...packageData.licenses,
          ...Array.from(packageData.linkedLicenses.values()),
        ],
      };

      console.log('Request Data:', JSON.stringify(requestData, null, 2));

      try {
        const response = await axios.put(requestUrl, requestData, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });
        console.log(`Successfully corrected licenses for ${dependencyLocator} (${fetcherType})`);
        console.log('Response:', response.data);
      } catch (error) {
        console.error(`Error correcting licenses for ${dependencyLocator} (${fetcherType})`);
        console.error(error.response ? error.response.data : error.message);
      }
    }

    console.log('CSV processing finished');
  });
