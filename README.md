# License Corrections

Here are some ways to do license corrections in FOSSA:

- For singular license corrections, use `license-corrections.js`
- For bulks license corrections, use `bulk-license-corrections.js`

## Guide for using `license-corrections.js`

### How to use this script

Provide the fetcher, package name, license grouping, list of licenses and your FOSSA API Key. The list of license ids can be fetched from the FOSSA UI. Ask the FOSSA support team or your dedicated Customer Success team to give you the list of licenses. The list of packages can be exported from the issues page (project/global).

#### Fetcher type

The fetcher type of a package can be found in the UI, in particular when looking at an issue, the fetcher type is associated with the package:

<img width="567" alt="image" src="https://github.com/fossas/fossa-license-corrections/assets/1427948/5f5a642f-a08c-498f-9a22-c1da75c4fa3e">

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

## Guide for using `bulk-license-corrections.js`.

#### Requirements

You must have a csv file with the following headers and supplied data for required columns:

`fossa-dependency-locator,fossa-fetcher-type,fossa-license-grouping,linked-grouping-id,corrected-license-id,corrected-license-text,package-url`

- `fossa-dependency-locator`: This is the dependency name.
- `fossa-fetcher-type`: This is the fetcher type of the dependency.
- `fossa-license-grouping`: The grouping can either be `separate-grouping` or `linked-grouping`. See above singular license corrections guide for further definitions.
- `linked-grouping-id`: This is required if multiple licenses of a package must be linked in a singular linked-grouping. ID must be unique. Best to go with integers. This field is not required for `separate-grouping`.
- `corrected-license-id`: This is the license id that FOSSA recognizes.
- `corrected-license-text`: This is the path to the corrected license.
- `package-url`: This is the correct package url.

The data must be clean and understandable, and it must match your understanding of how the license corrections must be done. A package with a singular license correction with a grouping of `linked-grouping` is valid, and acts like a `separate-grouping`, but it is not recommended to label such an entry. Please review the test data that is included in this repository.

### How to use this script

Here's how to run `bulk-license-corrections.js`: 

```
node license-corrections.js <fossa-api-key> <path-to-csv-of-license-corrections>
```

#### Limitations

This script doesn't automatically fetch a package's `fetcher type`. Fetching the dependency's `fetcher type` is still a work in progress. If you need help finding the `fetcher type`, please contact your dedicated FOSSA Customer Success team and/or the FOSSA support team at support@fossa.com.
