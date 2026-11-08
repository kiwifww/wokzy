import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {seedRecipes,sampleRecipes} from '../dist/data.js';
import {cookRecipes} from '../dist/cook-data.js';
import {mergeCatalog,personalRecipes} from '../dist/catalog.js';
import {matchRecipe,shoppingText,sortRecipes} from '../dist/core.js';
const source=JSON.parse(fs.readFileSync(new URL('../vendor/cook/recipe-text.json',import.meta.url)));
test('上游全部 887 道索引导入，稳定 ID 不与原有菜谱冲突',()=>{
 assert.equal(cookRecipes.length,887);assert.equal(seedRecipes.length,893);
 assert.equal(new Set(seedRecipes.map(r=>r.id)).size,seedRecipes.length);
 assert.equal(cookRecipes.filter(r=>r.videoUrl).length,675);
 for(const r of cookRecipes){assert.equal(r.id,`cook-${r.sourceId}`);assert.ok(r.name&&r.ingredients.length&&r.sourceUrl);assert.match(r.sourceUrl,/^https:\/\//);assert.ok(r.ingredients.every(i=>i.name&&i.qty===null));}
});
test('232 道完整正文保留原始区块，步骤逐条来自原文',()=>{
 assert.equal(cookRecipes.filter(r=>r.steps.length).length,232);
 for(const r of cookRecipes.filter(r=>r.sourceBlocks.length)){
  assert.deepEqual(r.sourceBlocks,source.recipes[r.sourceId].blocks);
  const parts=r.sourceBlocks.flatMap(b=>b.type==='list'?b.items:b.type==='paragraph'?[b.text]:[]);
  assert.ok(r.steps.every(s=>parts.includes(s.text)));
 }
 assert.ok(cookRecipes.find(r=>r.sourceId===398).steps.some(s=>s.title==='最终步骤'));
});
test('外链菜谱不编造步骤、人数、耗时或定量，主料匹配仍提示核对完整配料',()=>{
 const r=cookRecipes.find(r=>!r.steps.length&&r.videoUrl);
 assert.equal(r.minutes,null);assert.equal(r.servingsKnown,false);assert.equal(r.ingredientsComplete,false);
 assert.equal(r.steps.length,0);
 const stock=r.ingredients.map(i=>({name:i.name,qty:null,unit:''}));
 assert.equal(matchRecipe(r,stock).ready,true);
 assert.match(shoppingText(r,stock,1),/完整配料/);
 assert.doesNotMatch(shoppingText(r,stock,1),/1人份|食材种类已列齐/);
 assert.doesNotThrow(()=>sortRecipes(seedRecipes,stock));
});
test('旧数据追加新菜谱时保留自建菜谱与用户修改，重复载入不重复导入',()=>{
 const own={id:'personal-test',name:'自己的菜',ingredients:[],steps:[]};
 const edited={...cookRecipes[0],name:'我的版本',editedAt:'2026-11-09'};
 const saved=[structuredClone(sampleRecipes[0]),own,edited];
 const merged=mergeCatalog(saved,seedRecipes);
 assert.equal(merged.find(r=>r.id===own.id),own);assert.equal(merged.find(r=>r.id===edited.id),edited);
 assert.equal(merged.length,894);assert.equal(mergeCatalog(merged,seedRecipes).length,894);
 const persisted=personalRecipes(merged);assert.ok(persisted.includes(edited));assert.ok(persisted.includes(own));
 assert.equal(persisted.length,8);assert.equal(mergeCatalog(persisted,seedRecipes).length,894);
});
test('浏览器数据只保存个人记录，不重复写入大体积的公共菜谱',()=>{
 assert.equal(personalRecipes(seedRecipes).length,6);
 assert.ok(JSON.stringify(personalRecipes(seedRecipes)).length<20000);
 const restored=mergeCatalog(personalRecipes(seedRecipes),seedRecipes);
 assert.deepEqual(restored.map(r=>r.id),seedRecipes.map(r=>r.id));
});
