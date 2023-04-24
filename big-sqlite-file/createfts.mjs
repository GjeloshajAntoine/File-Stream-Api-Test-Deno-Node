import { faker } from '@faker-js/faker';
import Database from 'better-sqlite3';
import process from 'process';
const db = new Database('./bigwalless.db', {timeout: 50000});
db.pragma('journal_mode = WAL');


db.exec(`
    CREATE VIRTUAL TABLE IF NOT EXISTS search USING fts3(content TEXT);
`)



const addSamples = db.prepare(`
    INSERT INTO search(content) VALUES (@text);
`);


// const fakedList = Array.from({length: 1_000_000}).map((_,idx) => {
//     const text = faker.lorem.sentences();
//     return ({text})
// })


console.time('inserting')
// db.transaction(()=>fakedList.map(faked => addSamples.run(faked)))()
console.timeEnd('inserting')

const memu = () => process.memoryUsage().heapUsed / (1024 * 1024);

console.log('memu',memu());
console.time('search')
const res = db.prepare(`SELECT content FROM search WHERE content MATCH 'lab*' AND rowid > 15 LIMIT 16`).get()
console.timeEnd('search')

console.table(res);
console.log('memu',memu());