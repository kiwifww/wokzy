import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ingredientAsset,ingredientImage,dishImage,ingredientIcons} from '../dist/ingredient-icons.js';
import {seedRecipes} from '../dist/data.js';

test('每道示例菜谱的全部食材都有专属像素图，包括调料',()=>{
 for(const r of seedRecipes)for(const i of r.ingredients)assert.notEqual(ingredientAsset(i.name),'assets/ingredients/generic.png',i.name);
});
test('别名使用同一张图，未知和特殊名称始终返回安全的通用图片',()=>{
 assert.equal(ingredientAsset('西红柿'),ingredientAsset('番茄'));
 assert.equal(ingredientAsset('大蒜'),ingredientAsset('蒜'));
 for(const name of ['秋葵','自定义食材','constructor','__proto__','<img onerror=alert(1)>','',null]){
  assert.equal(ingredientAsset(name),'assets/ingredients/generic.png');
  assert.doesNotMatch(ingredientImage(name),/onerror|alert\(/);
 }
});
test('所有图标文件存在且是带透明通道的 24×24 PNG',()=>{
 const paths=new Set([...Object.keys(ingredientIcons).map(ingredientAsset),'assets/ingredients/generic.png','assets/ingredients/pot.png','assets/ingredients/plate.png']);
 for(const filename of paths){
  const png=readFileSync(new URL('../dist/'+filename,import.meta.url));
  assert.deepEqual([...png.subarray(0,8)],[137,80,78,71,13,10,26,10],filename);
  assert.equal(png.readUInt32BE(16),24,filename);assert.equal(png.readUInt32BE(20),24,filename);assert.equal(png[25],6,filename);
 }
});
test('已有的个人菜谱即使保存着旧 emoji 也使用图片，无需改动用户数据',()=>{
 const legacy={name:'自己的菜谱',emoji:'🍲',ingredients:[{name:'秋葵',category:'主料'}]};
 assert.match(dishImage(legacy),/generic\.png/);assert.doesNotMatch(dishImage(legacy),/\p{Extended_Pictographic}/u);
 for(const filename of ['app.js','data.js'])assert.equal(/[\u{1F300}-\u{1FAFF}]/u.test(readFileSync(new URL('../dist/'+filename,import.meta.url),'utf8')),false,filename+' still contains emoji');
});
