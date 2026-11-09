import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {seedRecipes} from '../dist/data.js';
import * as core from '../dist/core.js';
import * as icons from '../dist/ingredient-icons.js';
import * as catalog from '../dist/catalog.js';

// A small document boundary mock exercises the actual app renderer without
// depending on a browser or making network requests.
function app(){
 const nodes=new Map();const node=selector=>{if(!nodes.has(selector))nodes.set(selector,{innerHTML:'',textContent:'',focus(){},classList:{add(){},remove(){}}});return nodes.get(selector);};
 const saved=new Map();const ctx=vm.createContext({seedRecipes,...core,...icons,...catalog,structuredClone,URL,console,location:{hash:'#library'},document:{querySelector:node,addEventListener(){},body:{classList:{add(){},remove(){}}}},window:{addEventListener(){}},localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)},requestAnimationFrame:fn=>fn(),setTimeout:()=>0,clearTimeout(){}});
 const code=fs.readFileSync(new URL('../dist/app.js',import.meta.url),'utf8').replace(/^import .*;\r?\n/gm,'');
 vm.runInContext(code,ctx);return {ctx,node,saved,run:code=>vm.runInContext(code,ctx)};
}
test('真实菜谱列表首屏只渲染 24 道，搜索和加载更多作用于全部 893 道',()=>{
 const a=app();assert.equal(a.node('#recipe-count').textContent,'893 道');
 assert.equal((a.node('#recipe-grid').innerHTML.match(/<article /g)||[]).length,24);
 assert.ok(a.node('#recipe-grid').innerHTML.includes('load-more'));
 a.run('visibleCount=48;renderCards()');assert.equal((a.node('#recipe-grid').innerHTML.match(/<article /g)||[]).length,48);
 a.run("query='蜜汁脆皮烤鸡';visibleCount=24;renderCards()");
 assert.match(a.node('#recipe-grid').innerHTML,/cook-169/);
 assert.doesNotMatch(a.node('#recipe-grid').innerHTML,/0 分钟|1 人份|undefined|NaN/);
 assert.ok(JSON.parse(a.saved.get('wokzy.personal.v1')).recipes.length===6);
});
test('视频索引详情只显示外部做法，文字菜谱可展开全文并进入真实烹饪步骤',()=>{
 const a=app();a.run("detail('cook-0')");let html=a.node('#overlay').innerHTML;
 assert.match(html,/https:\/\/www.bilibili.com\/video\//);assert.doesNotMatch(html,/data-action="start-cook"|data-action="serving-plus"/);
 assert.match(html,/主料索引/);assert.match(html,/耗时未注明/);
 a.run("detail('cook-398')");html=a.node('#overlay').innerHTML;
 assert.match(html,/展开完整文字配方/);assert.match(html,/data-action="start-cook"/);assert.match(html,/火腿肠预处理/);
 a.run('startCook()');html=a.node('#overlay').innerHTML;
 assert.match(html,/按原方/);assert.match(html,/将火腿肠撕开包装/);assert.doesNotMatch(html,/undefined|NaN/);
});
test('来源筛选与搜索、收藏组合生效；卡片与详情显示对应来源',()=>{
 const a=app();assert.match(a.run('recipeToolbar()'),/筛选菜谱来源/);
 a.run("sourceFilter='yunyoujun';renderCards()");assert.equal(a.node('#recipe-count').textContent,'887 道');
 assert.match(a.node('#recipe-grid').innerHTML,/recipe-source source-yunyoujun">YunYouJun/);
 a.run("sourceFilter='sample';renderCards()");assert.equal(a.node('#recipe-count').textContent,'6 道');
 a.run("sourceFilter='mine';renderCards()");assert.equal(a.node('#recipe-count').textContent,'0 道');
 a.run("state.recipes.push({...structuredClone(seedRecipes[0]),id:'my-test',sourceType:'原创',editedAt:'2026-11-09'});renderCards()");
 assert.equal(a.node('#recipe-count').textContent,'1 道');assert.match(a.node('#recipe-grid').innerHTML,/source-mine">我的/);
 a.run("sourceFilter='yunyoujun';query='蜜汁脆皮烤鸡';renderCards()");assert.equal(a.node('#recipe-count').textContent,'1 道');
 a.run("page='favorites';state.favorites=['cook-169','my-test'];renderCards()");assert.equal(a.node('#recipe-count').textContent,'1 道');
 a.run("detail('cook-169')");assert.match(a.node('#overlay').innerHTML,/detail-source source-yunyoujun">YunYouJun/);
});
test('改编后的上游菜谱在我的筛选中出现且保留 YunYouJun 标记',()=>{
 const a=app();a.run("state.recipes.find(r=>r.id==='cook-169').editedAt='2026-11-09';sourceFilter='mine';renderCards()");
 assert.equal(a.node('#recipe-count').textContent,'1 道');assert.match(a.node('#recipe-grid').innerHTML,/我的改编 · YunYouJun/);
 a.run("sourceFilter='yunyoujun';renderCards()");assert.equal(a.node('#recipe-count').textContent,'886 道');
});
