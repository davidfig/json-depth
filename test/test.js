const fs = require('fs')

const jsonDepth = require('../json-depth')
const DATA = require('./test.json')

fs.writeFile('test/test-output.json', jsonDepth(DATA, { depth: 3 }), () =>
{
    console.log('wrote file: test-output.json')
    process.exit(0)
})