# Convert Tucson .rwl to JSON

Parses Tucson rwl ring width text into JSON.

An in-depth description of the Tucson rwl format can be found [here](https://www.treeringsociety.org/resources/SOM/Brewer_Murphy_SupplementaryMaterial.pdf)

This implementation uses somewhat strict interpretation of the file format specification, although it seems there is not always consistency in how the format is used.


### Installation

```sh
npm install rwl
```

## Usage

### In the command line


Write to a file

```sh
rwl2json example.rwl -o example.json
```

Pipe output to a file or another program
```sh
rwl2json example.rwl > example.json
```

### In the browser 

#### as an ES6 Module
```js
import rwl from 'rwl';
```

#### from a script tag
```html
<script src="path/to/dist/rwl-iife.min.js"></script>
```

### In node

```js
const fs = require('fs');
const rwl = require('rwl');

fs.readFile('./example.rwl', 'utf8', (err,data)=>{
    let dendroJson = rwl(data);
    ...

})
```

## CLI Reference

    rwl2json -h 
    rwl2json --help

Output usage information.

    rwl2json -V 
    rwl2json --version

Output the version number.

    rwl2json -o file 
    rwl2json --out file

Specify the output file name. Defaults to stdout.


## API Reference

rwl(text)

Returns a JSON string of the parsed rwl text

---


JSON Schema of output
```js

{
    "$schema": "http://json-schema.org/draft-06/schema#",
    "title": "Tucson rwl file",
    "description": "rwl file format",
    "type": "object",
    "properties": {
        "metadata": {
            "type": "object",
            "properties": {
                "siteId": {
                    "description": "Unique identifier for collection site",
                    "type": "number"
                },
                "siteName": {
                    "description": "Full name of collection site",
                    "type": "string"
                },
                "speciesCode": {
                    "description": "Three or Four letter species code"
                    "type": "string",
                },
                "species": {
                      "description": "Full name of species"
                    "type": "string",
                },
                "state" : {
                     "description": "State where samples where collected"
                    "type": "string",
                }
                "elevation": {
                    "type": "number",
                },
                "location": {
                    "title": "GeoJSON Point",
                    "type": "object",
                    "required": ["type", "coordinates"],
                    "properties": {
                        "type": {
                        "type": "string",
                        "enum": ["Point"]
                        },
                        "coordinates": {
                            "type": "array",
                            "minItems": 2,
                            "items": {
                                "type": "number"
                            }
                        }
                    }
                },
                "firstYear":{
                    "description": "First year of samples chronology"
                    "type": "number",
                }
                "lastYear":{
                    "description": "Last year of samples chronology"
                    "type": "number",
                },
                "leadInvestigator":{
                    "description": "Full name of lead investigator"
                    "type": "string",
                }
            }
     
        
        }
        ,
        "samples": {
            "type": "array",
            "items": {
                "year": "number",
                "width": "number"
            },
            "minItems": 1
        }
    }
}

```