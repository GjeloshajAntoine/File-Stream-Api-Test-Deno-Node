import * as fs from 'node:fs';

console.log('test');

const fileStat = fs.statSync('index.mjs')

console.log('stats', fileStat, Math.round(fileStat.size/2));
const halfSize = Math.round(fileStat.size/2);

const file = fs.createReadStream('index.mjs',{ highWaterMark: 30, start: halfSize })

file.on('data',data => { 
    console.log(' ', data.toString());
})  