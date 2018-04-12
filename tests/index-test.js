const fs = require('fs');
const rwl = require('../');
const test = require('tape');

test("test parse function", function(test) {
    let testRwl = fs.readFileSync("tests/tx056.rwl", "utf8");
    let actual = rwl(testRwl);
    let expected = fs.readFileSync("tests/tx056.json", "utf8");
    test.deepEqual(actual, expected);
    test.end();
});