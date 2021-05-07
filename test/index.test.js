const fs = require('fs');
const rwl = require('../dist/rwl');

test('correctly parses example file without metadata', () => {
	let testRwl = fs.readFileSync('test/nm617.rwl', 'utf8');
	let actual = rwl(testRwl);
	let expected = fs.readFileSync('test/nm617_series_date.json', 'utf8');
	expect(JSON.parse(expected)).toEqual(actual);
});

test('correctly parses example file without metadata and date as number', () => {
	let testRwl = fs.readFileSync('test/nm617.rwl', 'utf8');
	let actual = rwl(testRwl, { formatDates: false });
	let expected = fs.readFileSync('test/nm617_series.json', 'utf8');
	expect(JSON.parse(expected)).toEqual(actual);
});

test('correctly parses example file with metadata', () => {
	let testRwl = fs.readFileSync('test/nm617.rwl', 'utf8');
	let actual = rwl(testRwl, { metadata: true });
	let expected = fs.readFileSync('test/nm617.json', 'utf8');
	expect(JSON.parse(expected)).toEqual(actual);
});
