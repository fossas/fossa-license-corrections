# License Corrections
A one-off scripty way to do license corrections in FOSSA

### How to use this script

Provide the fetcher, package name, license grouping, list of licenses and your FOSSA API Key. The list of license ids are contained in the license-ids.csv provided. Do note the list of licenses change overtime, so the one listed here is not always accurate 😜.

#### License grouping

For more than one license that is added to a correction, here's what the following options mean:

- `separate`: This means the corrections are separate for more than one license that's added
- `choose`: This means the user can choose between multiple licenses in a license grouping.

Either option can be used to correct a package with one license.

See this example (by no means is this accurate and is just a mere example):
```
// Correct the grpc package with the Apache 2.0 license in a separate license group
node license-corrections.js gem grpc separate Apache-2.0 <fossa-api-key>

// Correct the grpc package with Apache 2.0 and MIT licenses but in separate groupings
node license-corrections.js gem grpc separate Apache-2.0, MIT <fossa-api-key>

// Correct the grpc package with the Apache 2.0 and MIT licenses, but make it a choice to choose between these licenses in a single license group
node license-corrections.js gem grpc choose Apache-2.0, MIT <fossa-api-key>
```
