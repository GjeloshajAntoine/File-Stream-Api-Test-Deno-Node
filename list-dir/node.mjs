import { readdir } from "node:fs/promises";


const dossiers = await readdir('./')

console.log(dossiers);