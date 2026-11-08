import fs from 'node:fs';
const p=new URL('../dist/styles.css',import.meta.url);
fs.writeFileSync(p,fs.readFileSync(p,'utf8').replaceAll('pantry-pixels','pantry-illustrations'));
