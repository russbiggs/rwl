const fs = require('fs');
const rwl = require('../');
const rewire = require('rewire');
const test = require('tape');

const userRewire = rewire('../')
const parseMeasurements = userRewire.__get__('parseMeasurements')
const parseMetadata = userRewire.__get__('parseMetadata')
const parseCoord = userRewire.__get__('parseCoord')

test("test parseMeasurements", (test) => {
    const rawMeasurements = `GPM01A  1880    50   286   183   252   331   279    63   336   423   419
GPM01A  1890   320  1019   365   395   380   858   704   793   861   441`;
    const measurements = parseMeasurements(rawMeasurements.split('\n'));
    const expected = [ { sampleId: 'GPM01A', measurements: [ { year: 1880, width: 50 }, { year: 1881, width: 286 }, { year: 1882, width: 183 }, { year: 1883, width: 252 }, { year: 1884, width: 331 }, { year: 1885, width: 279 }, { year: 1886, width: 63 }, { year: 1887, width: 336 }, { year: 1888, width: 423 }, { year: 1889, width: 419 }, { year: 1890, width: 320 }, { year: 1891, width: 1019 }, { year: 1892, width: 365 }, { year: 1893, width: 395 }, { year: 1894, width: 380 }, { year: 1895, width: 858 }, { year: 1896, width: 704 }, { year: 1897, width: 793 }, { year: 1898, width: 861 }, { year: 1899, width: 441 } ] } ]
    test.deepEqual(measurements, expected)
    test.end();
});

test("test parseMetadata", (test) => {
    const rawMetadata = `GPM    1 Guadalupe Peak                                      PSME               
GPM    2 Texas        Douglas-fir       2417M  3154-10450    __    1880 2008    
GPM    3 Daniel Griffin   Russ Biggs                                            `;

    const metadata = parseMetadata(rawMetadata.split('\n'));
    const expected = {"siteId":"GPM","siteName":"Guadalupe Peak","speciesCode":"PSME","state":"Texas","species":"Douglas-fir","elevation":"2417","location":{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[104.5,31.54]}},"firstYear":1880,"lastYear":2008,"leadInvestigator":"Daniel Griffin"};
    test.deepEqual(metadata, expected)
    test.end();
});

test("test parseCoord", (test) => {
    const lat = parseCoord('3154');
    test.equal(lat, 31.54);
    test.end();
})

test("test parse function", (test) => {
    let testRwl = fs.readFileSync("test/tx056.rwl", "utf8");
    let actual = rwl(testRwl);
    let expected = fs.readFileSync("test/tx056.json", "utf8");
    test.deepEqual(actual, expected);
    test.end();
});