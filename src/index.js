export default function rwl(rwlText, { metadata = false, formatDates = true } = {}) {
	const output = {};
	if (metadata) {
		const metadataRows = rwlText.split('\n').slice(0, 3);
		output['metadata'] = parseMetadata(metadataRows);
	}
	const seriesRows = rwlText.split('\n').slice(3).filter((r) => r != '');
	output['series'] = parseSeries(seriesRows, formatDates);
	return output;
}

function createMeasurement(row, formatDates) {
	const startYear = row[1];
	const widths = row.slice(2);
	let measurements = [];
	for (let i = 0; i < widths.length; i++) {
		const year = parseInt(startYear) + i;
		let date;
		if (formatDates) {
			date = new Date(Date.UTC(year)).toJSON();
		} else {
			date = year;
		}
		let measurement = {
			year: date,
			width: widths[i]
		};
		measurements.push(measurement);
	}
	return measurements;
}

function parseSeries(measurementRows, formatDates) {
	const rows = measurementRows.map((row) => row.split(' ').filter((x) => x != ''));
	let samples = [];
	let i = -1;
	for (const row of rows) {
		const seriesId = row[0];
		const exists = samples.some((o) => o.seriesId === seriesId);
		if (exists) {
			samples[i].measurements = samples[i].measurements.concat(createMeasurement(row, formatDates));
		} else {
			i += 1;
			const series = { seriesId: seriesId, measurements: [] };
			samples.push(series);
			samples[i].measurements = samples[i].measurements.concat(createMeasurement(row, formatDates));
		}
	}
	for (const sample of samples) {
		let divisor = 1;
		const stopMarker = sample.measurements.pop().width;
		if (stopMarker == 999) {
			divisor = 100;
		}
		if (stopMarker == -9999) {
			divisor = 1000;
		}
		sample.measurements = sample.measurements.map((o) => {
			return { year: o.year, width: o.width / divisor };
		});
	}
	return samples;
}

function parseMetadata(metadataRows) {
	const metadata = {};
	const rows = metadataRows;
	const firstRow = rows[0].split(/\s\s/);
	const firstRowValues = firstRow.filter((x) => x != '');
	metadata['siteId'] = firstRowValues[0];
	metadata['siteName'] = firstRowValues[1].replace(/^1\s/, '');
	metadata['speciesCode'] = firstRowValues[2].replace(/^s/, '');
	const secondRow = rows[1].split(/\s\s/);
	const secondRowValues = secondRow.filter((x) => x != '');
	metadata['state'] = secondRowValues[1].replace(/^2\s/, '');
	metadata['species'] = secondRowValues[2].replace(/^\s/, '');
	metadata['elevation'] = parseInt(secondRowValues[3].match(/(\d+)/)[1]);
	let latLng = secondRowValues[4];
	if (latLng.indexOf(' ') > -1) {
		latLng = latLng.split(/\s+/);
	}
	if (latLng.indexOf('-') > -1) {
		latLng = latLng.split('-');
	}
	const lat = parseCoord(latLng[0]);
	const lng = parseCoord(latLng[1]);
	metadata['lngLat'] = [ lng, lat ];
	const [ firstYear, lastYear ] = secondRowValues[6].split(/\s/);
	metadata['firstYear'] = parseInt(firstYear);
	metadata['lastYear'] = parseInt(lastYear);
	metadata['leadInvestigator'] = parseNames(rows[2])[0];
	return metadata;
}

function parseNames(row) {
	const nameMatch = row.match(/\w+\s+3\s(.*)/)[1];
	const names = nameMatch.split(/(\s\band\b\s)|\s{2,}|\,\s+/).filter((elem) => {
		if (elem) {
			return true;
		}
		return false;
	});
	return names;
}

function parseCoord(value) {
	let degrees = value.slice(0, -2);
	let minutes = value.slice(-2);
	let coord = parseInt(degrees) + parseFloat(minutes) * 0.01;
	return parseFloat(coord.toFixed(2));
}
