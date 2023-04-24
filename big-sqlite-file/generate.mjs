import { faker } from '@faker-js/faker';
import Database from 'better-sqlite3';
import process from 'process';
const db = new Database('./bigwalless.db', {timeout: 50000});
db.pragma('journal_mode = WAL');

const memu = () => process.memoryUsage().heapUsed / (1024 * 1024);

db.exec(`
    CREATE TABLE IF NOT EXISTS samples (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        text TEXT NOT NULL
    )
`)

const addSamples = db.prepare(`
    INSERT INTO samples("id","name","text") VALUES (NULL,@name,@text);
`);


console.log('process',memu());
console.time('faking')
// faker.lorem.sentences() 

console.time('insert test')
addSamples.run({name: 'test name', text: 'test text longer'});
console.timeEnd('insert test')
console.log('process',memu());


const fakedList = Array.from({length: 1_000_000}).map((_,idx) => {
    const name = faker.name.fullName();
    const text = faker.lorem.sentences();
    // addSamples.run({name, text});
    return ({name, text})
})

console.log('process',memu());

console.timeEnd('faking')


console.time('inserting')

db.transaction(()=>fakedList.map(faked => addSamples.run(faked)))()

// fakedList.map(faked => addSamples.run(faked))

console.timeEnd('inserting')