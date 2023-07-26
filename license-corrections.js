const axios = require('axios');

async function runFossaCorrection(fetcherType, packageName, grouping, licenseIds, fossaApiKey) {
  try {
    const url = `https://app.fossa.com/api/projects/${encodeURIComponent(fetcherType)}%2B${encodeURIComponent(packageName)}/correction`;

    const parsedLicenseIds = licenseIds.split(',').map(id => ({ licenseId: id.trim() }));

    let payload;
    if (grouping === 'choose') {
      payload = { licenses: [parsedLicenseIds] };
    } else if (grouping === 'separate') {
      payload = { licenses: parsedLicenseIds.map(id => [id]) };
    } else {
      console.log('Invalid grouping argument. Use "choose" or "separate".');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${fossaApiKey}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await axios.put(url, payload, config);
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

if (process.argv.length !== 7) {
  console.log('Usage: node license-corrections.js <fetcher-type> <package-name> <license-grouping> <license-ids> <fossa-api-key>');
} else {
  const fetcherType = process.argv[2];
  const packageName = process.argv[3];
  const grouping = process.argv[4];
  const licenseIds = process.argv[5];
  const fossaApiKey = process.argv[6];

  runFossaCorrection(fetcherType, packageName, grouping, licenseIds, fossaApiKey);
}
