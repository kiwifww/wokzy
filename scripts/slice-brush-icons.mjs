import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require('C:/Users/gogo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const input=process.argv[2];
if(!input)throw Error('Provide the generated atlas path');
const names=['tomato','egg','broccoli','garlic','mushroom','chicken','tofu','scallion','rice','seaweed','mince','salt','oil','ginger','sugar','soy','starch','sesameOil','beanPaste','pepper','carrot','onion','potato','cabbage','cucumber','greens','fish','shrimp','beef','pork','pepperVegetable','generic','pot','plate','okra','lemon'];
const output=new URL('../dist/assets/brush-ingredients/',import.meta.url);
await fs.mkdir(output,{recursive:true});
const {width,height}=await sharp(input).metadata();
for(let i=0;i<names.length;i++){
 const col=i%6,row=Math.floor(i/6),left=Math.round(col*width/6),top=Math.round(row*height/6);
 const tile=await sharp(input).extract({left,top,width:Math.round((col+1)*width/6)-left,height:Math.round((row+1)*height/6)-top}).png().toBuffer();
 await sharp(tile).resize(256,256,{fit:'contain',background:'#00000000'}).png().toFile(new URL(names[i]+'.png',output).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
}
console.log(`Sliced ${names.length} brush illustrations from ${width}×${height} atlas.`);
