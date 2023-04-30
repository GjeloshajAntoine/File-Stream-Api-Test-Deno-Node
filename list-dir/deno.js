const dossiers = Deno.readDir('./');

async function toArray(asyncIterator){ 
    const arr=[]; 
    for await(const i of asyncIterator) arr.push(i); 
    return arr;
}


console.log(await toArray(dossiers));
