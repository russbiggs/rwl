export default function parse(rwlText) {
    const output = {};
    const metadataRows = rwlText.split('\n').slice(0, 3);
    output['metadata'] = parseMetadata(metadataRows);
    const measurementRows = rwlText.split('\n').slice(3);
    output['samples'] = parseMeasurements(measurementRows);
    return JSON.stringify(output);
}

function parseMeasurements(measurementRows) {
    const rows = measurementRows;
    const series = [];
    for (const row of rows) {
        const obj = {};
        const splitRow = row.split(/\s+/g);
        obj['sampleId'] = splitRow[0];
        const measurements = splitRow.slice(1);
        const startYear = parseInt(measurements.shift());
        const measurementSet = []
        for (let i=0; i<measurements.length; i++) {
            const measureObj = {};
            measureObj['year'] = startYear + i;
            measureObj['width'] = parseInt(measurements[i]);
            measurementSet.push(measureObj);
        }
        obj['measurements'] = measurementSet;
        series.push(obj);
    }
    const sampleObjs = series.reduce((obj, item) => {
        obj[item.sampleId] = obj[item.sampleId] || [];
        obj[item.sampleId].push(...item.measurements);
        return obj
    }, {});

    const samples = []
    for (const sample in sampleObjs) {
        samples.push({ sampleId: sample, measurements: sampleObjs[sample] })
    }
    return samples;
}

function parseMetadata(metadataRows) {
    const metadata = {};
    const rows = metadataRows;
    metadata['siteId'] = rows[0].slice(0, 6).replace(/\s*/g, '');
    const row1Matches = rows[0].slice(9).match(/(\w+)/g);
    metadata['siteName'] = row1Matches.slice(0, -1).join(' ');
    metadata['speciesCode'] = row1Matches.slice(-1)[0];
    const stateSplit = rows[1].split(/\s{2,}/)
    metadata['state'] = stateSplit[1].match(/2\s([A-Za-z\s]+)/)[1]
    metadata['species'] = rows[1].match(/\d+[A-Za-z\s]+\s\s+([A-Za-z\s\-\']+)\b\s\s+\d/)[1]
    const elevation = rows[1].match(/\d+M/)[0];
    const elevationValue = elevation.match(/\d+/);
    metadata['elevation'] = elevationValue[0];
    let latLng = rows[1].match(/\s(\d+\-*\s*\d+)\s/)[1]
    if (latLng.indexOf(' ') > -1) {
        latLng = latLng.split(/\s+/)
    }
    if (latLng.indexOf('-') > -1) {
        latLng = latLng.split('-')
    }
    const lat = parseCoord(latLng[1]);
    const lng = parseCoord(latLng[0]);
    metadata['location'] = {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Point",
            "coordinates": [lat, lng]
        }
    };
    const [firstYear, lastYear] = rows[1].match(/(\d{4})\s*(\d{4})\s*$/).slice(1);
    metadata['firstYear'] = parseInt(firstYear);
    metadata['lastYear'] = parseInt(lastYear);
    metadata['leadInvestigator'] = parseNames(rows[2])[0]
    return metadata
}


function parseNames(row) {
    const nameMatch = row.match(/\w+\s+3\s(.*)/)[1];
    const names = nameMatch.split(/(\s\band\b\s)|\s{2,}|\,\s+/).filter((elem)=> {if (elem) { return true } return false });
    return names
}

function parseCoord(value) {
    let degrees = value.slice(0, -2);
    let minutes = value.slice(-2);
    let coord = parseInt(degrees) + (parseFloat(minutes) * 0.01);
    return parseFloat(coord.toFixed(2));
}