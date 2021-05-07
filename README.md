# Read Tucson rwl files in Javascript

Parses Tucson rwl ring width text for Javascript

An in-depth description of the Tucson rwl format can be found [here](https://www.treeringsociety.org/resources/SOM/Brewer_Murphy_SupplementaryMaterial.pdf)


## Installation

```sh
npm install rwl
```

## Usage

### Node

```js
import rwl from 'rwl';

const fs = require('fs');
const rwl = require('rwl');

fs.readFile('./example.rwl', 'utf8', (err,data)=>{
    let dendroData = rwl(data);
    ...
})
```

### In the browser

```html
<script>

const res = fetch('./my-rwl.rwl')
const data = await res.text();
const dendroData = rwl(data); 
... 
</script>
```


## API Reference

__rwl(text)__

Returns an JSON object of the parsed Tucson rwl text

### Parameters

-   `rwlText` **string** input string of Tucson rwl file
-   `options` **object** optional configuration parameters
    - `options.metadata` **boolean** _default false_ if true parses metadata from rwl file and returns in output JSON
    - `options.formatDates` **boolean** _default true_ if true returns year as JavaScript Date, if false returns year as number. e.g. 1724-01-01T00:00:00.000Z or 1724

### Output

JSON Schema of output:
```json
{
    "$schema": "http://json-schema.org/draft-06/schema#",
    "title": "Tucson rwl file",
    "description": "rwl file format in JSON",
    "type": "object",
    "properties": {
        "metadata": {
            "type": "object",
            "properties": {
                "siteId": {
                    "description": "Unique identifier for collection site",
                    "type": "string"
                },
                "siteName": {
                    "description": "Full name of collection site",
                    "type": "string"
                },
                "speciesCode": {
                    "description": "Three or Four letter species code",
                    "type": "string",
                },
                "species": {
                      "description": "Full name of species",
                    "type": "string",
                },
                "state" : {
                    "description": "State or country where samples where collected",
                    "type": "string",
                },
                "elevation": {
                    "description": "Elevation in meters of the site",
                    "type": "number",
                },
                "lngLat": {
                    "description": "longitude latitude pair of site coordinates",
                    "type": "array",
                    "items": {
                        "type": "number"
                    }
                },
                "firstYear":{
                    "description": "First year of series",
                    "type": "number",
                },
                "lastYear":{
                    "description": "Last year of series",
                    "type": "number",
                },
                "leadInvestigator":{
                    "description": "Full name of lead investigator",
                    "type": "string",
                }
            }
        },
        "series": {
            "description": "array of measurement objects each representing a ring width measurement for a given year"
            "type": "array",
            "items": {
              "description": "object representing a ring width measurement for a given year",
              "type": "object",
              "required": ["year", "width"],
              "properties": {
                "year": {
                  "description": "year of measurement, either as year as an integer or ISO 8601 date string",
                  "type": ["number", "string"]
                },
                "width": {
                  "description": "measurement width in millimeters",
                  "type": "number"
                }
              }
            },
            "minItems": 1
        }
    },
    "required": [ "series" ]
}

```


Outputs measurements to mm (millimeters) convertered to 1/100th millimeter, i.e. 0.01mm or microns, i.e. 0.001mm, depending on the stop value provided. 

---


### Note about metadata: 
Tucson rwl metadata is not consistently implemented across software and sometimes seems to be manually input by users. There is a specification for metadata in Tucson rwl but unfortunately it seems it is rarely followed. For this reason this library defaults to not including the file metadata, just series data. With the optional ```options.metadata``` flag set to ```true``` ```rwl``` will include metadata in the output JSON but cannot guarantee its accuracy due to the inconsistent implementation in the wild. 
