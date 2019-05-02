const fs = require('fs');
const rwl = require('../');
const rewire = require('rewire');
const tape = require('tape');

const userRewire = rewire('../')
const parseMeasurements = userRewire.__get__('parseMeasurements')
const parseMetadata = userRewire.__get__('parseMetadata')
const parseCoord = userRewire.__get__('parseCoord')

tape("test parseMeasurements", (test) => {
    const rawMeasurements = `GPM01A  1880    50   286   183   252   331   279    63   336   423   419
GPM01A  1890   320  1019   365   395   380   858   704   793   861   441`;
    const measurements = parseMeasurements(rawMeasurements.split('\n'));
    const expected = [ { sampleId: 'GPM01A', measurements: [ { year: 1880, width: 50 }, { year: 1881, width: 286 }, { year: 1882, width: 183 }, { year: 1883, width: 252 }, { year: 1884, width: 331 }, { year: 1885, width: 279 }, { year: 1886, width: 63 }, { year: 1887, width: 336 }, { year: 1888, width: 423 }, { year: 1889, width: 419 }, { year: 1890, width: 320 }, { year: 1891, width: 1019 }, { year: 1892, width: 365 }, { year: 1893, width: 395 }, { year: 1894, width: 380 }, { year: 1895, width: 858 }, { year: 1896, width: 704 }, { year: 1897, width: 793 }, { year: 1898, width: 861 }, { year: 1899, width: 441 } ] } ]
    test.deepEqual(measurements, expected)
    test.end();
});

function testParseMetadata(name) {
    tape(`parseMetadata ${name}`, function(test) {
        fs.readFile(`test/${name}.rwl`, "utf8", (err, data)=> {
            const metadataRows = data.split('\n').slice(0,3);
            const metadata = parseMetadata(metadataRows);
            test.deepEqual(metadata, JSON.parse(fs.readFileSync("test/" + name + ".json", "utf8")), test.end());
        })
    });
}

testParseMetadata('mexi077');
testParseMetadata('nm617');
testParseMetadata('turk020');
testParseMetadata('ak162');

function testParseCoord(value, expected) {
    tape("test parseCoord", (test) => {
        const coord = parseCoord(value);
        test.equal(coord, expected);
        test.end();
    })
}

testParseCoord("3154", 31.54)
testParseCoord("17999", 179.99)
testParseCoord("0000", 0)

tape("test parse function", (test) => {
    let testRwl = fs.readFileSync("test/tx056.rwl", "utf8");
    let actual = rwl(testRwl);
    let expected = fs.readFileSync("test/tx056.json", "utf8");
    test.deepEqual(actual, expected);
    test.end();
});