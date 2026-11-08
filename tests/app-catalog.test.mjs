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
