import * as fs from 'node:fs';

console.log('test');

const file = fs.createReadStream('index.mjs')

console.log(file);

    