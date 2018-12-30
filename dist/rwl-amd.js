define(function () { 'use strict';

    function parse(rwlText) {
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
            const measurementSet = [];
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

        const samples = [];
        for (const sample in sampleObjs) {
            samples.push({ sampleId: sample, measurements: sampleObjs[sample] });
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
        const row2Matches = rows[1].slice(9).match(/([\w\-]+)/g);
        metadata['state'] = row2Matches[0];
        metadata['species'] = row2Matches[1];
        const elevation = row2Matches[2];
        const elevationValue = elevation.match(/\d+/);
        metadata['elevation'] = elevationValue[0];
        const latLng = row2Matches[3].split('-');
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
        const firstYear = row2Matches[5];
        metadata['firstYear'] = parseInt(firstYear);
        let lastYear = row2Matches[6];
        metadata['lastYear'] = parseInt(lastYear);
        let row3Matches = rows[2].slice(9).match(/\w+/g);
        metadata['leadInvestigator'] = row3Matches.slice(0, 2).join(' ');
        return metadata
    }

    function parseCoord(value) {
        let degrees = value.slice(0, -2);
        let minutes = value.slice(-2);
        let coord = parseInt(degrees) + (parseFloat(minutes) * 0.01);
        return parseFloat(coord.toFixed(2));
    }

    return parse;

});
