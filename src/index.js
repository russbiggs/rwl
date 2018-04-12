export default function parse(source) {
    let output = {};
    let metadata = parseMetadata(source);
    output['metadata'] = metadata;
    let measurements = parseMeasurements(source);
    output['samples'] = measurements;
    return JSON.stringify(output);
}

function parseMeasurements(source) {
    let rows = source.split('\n').slice(3);

    let series = rows.map((currentValue, index, array) => {
        let splitRow = currentValue.split(/\s+/g);
        let obj = {};
        obj['sampleId'] = splitRow[0];
        let measurements = splitRow.slice(1);
        let startYear = parseInt(measurements.shift());
        let measurementSet = measurements.map((currentValue, index, array) => {
            let measureObj = {};
            measureObj['year'] = startYear + index;
            measureObj['width'] = parseInt(currentValue);
            return measureObj;
        });
        obj['measurements'] = measurementSet;
        return obj;
    })
    let sampleObjs = series.reduce((obj, item) => {
        obj[item.sampleId] = obj[item.sampleId] || [];
        obj[item.sampleId].push(...item.measurements);
        return obj
    }, {});

    let samples = []
    for (let sample in sampleObjs) {
        samples.push({ sampleId: sample, measurements: sampleObjs[sample] })
    }
    return samples;
}


function parseMetadata(source) {
    let metadata = {};
    let rows = source.split('\n').slice(0, 3);
    metadata['siteId'] = rows[0].slice(0, 6).replace(/\s*/g, '');
    let words = /[^\s]+/g;
    let row1Matches = rows[0].slice(9).match(words)
    metadata['siteName'] = row1Matches.slice(0, -1).join(' ');
    metadata['speciesCode'] = row1Matches.slice(-1)[0];
    let row2Mmatches = rows[1].slice(9).match(words);
    let state = row2Mmatches[0];
    metadata['state'] = state;
    let species = row2Mmatches[1];
    metadata['species'] = species;
    let elevation = row2Mmatches[2];
    let digits = /\d+/;
    let elevationValue = row2Mmatches[2].match(digits);
    metadata['elevation'] = elevationValue[0];
    let latLng = row2Mmatches[3].split('-');
    let lat = parseCoord(latLng[1]);
    let lng = parseCoord(latLng[0]);
    metadata['location'] = locationGeoJSON([lat, lng]);
    let firstYear = row2Mmatches[5];
    metadata['firstYear'] = parseInt(firstYear);
    let lastYear = row2Mmatches[6];
    metadata['lastYear'] = parseInt(lastYear);
    let row3Mmatches = rows[2].slice(9).match(words);
    metadata['leadInvestigator'] = row3Mmatches.slice(0, 2).join(' ');
    return metadata
}

function parseCoord(value) {
    let degrees = value.slice(0, -2);
    let minutes = value.slice(-2);
    let coord = parseInt(degrees) + (parseFloat(minutes) * 0.01);
    return parseFloat(coord.toFixed(2));
}

function locationGeoJSON(coords) {
    let point = {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Point",
            "coordinates": []
        }
    };
    point.geometry.coordinates = coords;
    return point
}