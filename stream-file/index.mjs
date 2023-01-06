import * as fs from 'node:fs';

console.log('test');

const file = fs.createReadStream('index.mjs',{ highWaterMark: 10 })

file.on('data',data => { 
    console.log('data________: ', data.toString());
})