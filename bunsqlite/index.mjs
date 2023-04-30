import { faker } from '@faker-js/faker';
import { Database } from "bun:sqlite";
import { heapStats } from "bun:jsc";
function formatBytes(a,b=2){if(!+a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return`${parseFloat((a/Math.pow(1024,d)).toFixed(c))} ${["Bytes","KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"][d]}`}


const db = new Database("./bundata.db");
db.run(`PRAGMA journal_mode = WAL`);

db.query(`CREATE TABLE IF NOT EXISTS example (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text text
    );`).run()
db.query(`CREATE VIRTUAL TABLE IF NOT EXISTS search USING fts3(text TEXT);`).run()

console.log("meme", formatBytes(heapStats().heapSize));

console.log('DB info')

console.log(db.query(`
WITH opts(n, opt) AS (
    VALUES(0, NULL)
    UNION ALL
    SELECT n + 1,
           sqlite_compileoption_get(n)
    FROM opts
    WHERE sqlite_compileoption_get(n) IS NOT NULL
  )
  SELECT opt
  FROM opts
  ;

`).all());

// console.table(db.query(`SELECT * FROM search`).all())


// process.stdout.write('0');
// const examples = Array.from({length: 1_000_000}).map((_,idx) => {
//     const text = faker.lorem.text();
//     // process.stdout.write("\r\x1b[K");
//     // process.stdout.write(`${idx}`);
//     return ({$text:text});
// });

// const insertIntoSearch= db.prepare(`INSERT into search(text) VALUES($text)`)
// console.time('inserting')



// db.transaction(()=> {
//     examples.map(ex => insertIntoSearch.run(ex));
// })();


// console.timeEnd('inserting')

console.time('search')
console.log(db.query(`SELECT COUNT(*) FROM search WHERE text MATCH 'lab*'`).get())
console.timeEnd('search')

console.log("meme", formatBytes(heapStats().heapSize));
