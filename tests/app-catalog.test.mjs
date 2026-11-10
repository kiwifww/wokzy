import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {seedRecipes} from '../dist/data.js';
import * as core from '../dist/core.js';
import * as icons from '../dist/ingredient-icons.js';
import * as catalog from '../dist/catalog.js';
import * as picker from '../dist/picker.js';
import * as personal from '../dist/personal-recipe.js';

// A small document boundary mock exercises the actual app renderer without
// depending on a browser or making network requests.
function app(){
 const nodes=new Map();const node=selector=>{if(!nodes.has(selector))nodes.set(selector,{innerHTML:'',textContent:'',focus(){},classList:{add(){},remove(){}}});return nodes.get(selector);};
 const listeners=new Map();const saved=new Map();const ctx=vm.createContext({seedRecipes,...core,...icons,...catalog,...picker,...personal,structuredClone,URL,FormData:class {constructor(form){this.data=form.values;}get(k){return this.data[k]??'';}},crypto:{randomUUID:()=> 'personal-test'},console,location:{hash:'#library'},document:{querySelector:node,querySelectorAll:()=>[],addEventListener:(type,callback)=>listeners.set(type,callback),body:{classList:{add(){},remove(){}}}},window:{addEventListener(){}},localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)},requestAnimationFrame:fn=>fn(),setTimeout:()=>0,clearTimeout(){}});
 const code=fs.readFileSync(new URL('../dist/app.js',import.meta.url),'utf8').replace(/^import .*;\r?\n/gm,'');
 vm.runInContext(code,ctx);return {ctx,node,saved,listeners,run:code=>vm.runInContext(code,ctx)};
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
test('首页点选与取消实时影响相关菜谱，并保存食材；菜谱库仍可浏览全部数据',()=>{
 const a=app();a.run("page='home';render()");assert.equal(a.node('#recipe-count').textContent,'0 道');
 assert.match(a.node('#app').innerHTML,/点点食材/);assert.match(a.node('#recipe-grid').innerHTML,/先点选几样食材/);
 const click=name=>a.listeners.get('click')({target:{closest:()=>({dataset:{action:'pick-ingredient',name,staple:'false'}})}});
 click('番茄');assert.ok(a.run('filteredRecipes().length')>0);
 assert.ok(a.run("filteredRecipes().every(r=>r.ingredients.some(i=>i.name==='番茄'))"));
 assert.match(a.node('#app').innerHTML,/ingredient-option is-selected[^>]+data-name="番茄"/);
 assert.equal(JSON.parse(a.saved.get('wokzy.personal.v1')).pantry[0].name,'番茄');
 click('番茄');assert.equal(a.node('#recipe-count').textContent,'0 道');
 a.run("page='library';render()");assert.equal(a.node('#recipe-count').textContent,'893 道');
});
test('食材搜索按别名查找，更多分类与已选状态保留',()=>{
 const a=app();a.run("page='home';ingredientQuery='西红柿';renderIngredientOptions()");
 assert.match(a.node('#ingredient-options').innerHTML,/data-name="番茄"/);assert.doesNotMatch(a.node('#ingredient-options').innerHTML,/data-name="牛肉"/);
 a.run("ingredientQuery='';expandedIngredientGroups.add('vegetable');renderIngredientOptions()");
 assert.match(a.node('#ingredient-options').innerHTML,/data-name="冬瓜"/);
 a.run("state.pantry.push({name:'冬瓜',qty:2,unit:'块'});expandedIngredientGroups.clear();renderIngredientOptions()");
 assert.match(a.node('#ingredient-options').innerHTML,/is-selected[^>]+data-name="冬瓜"/);
});

test('视频灵感经实际提交保存为草稿，补齐后进入匹配和做菜模式，保留要点及链接',()=>{
 const a=app();const submit=(form,intent='ready')=>a.listeners.get('submit')({preventDefault(){},target:form,submitter:{value:intent}});
 submit({id:'capture-form',values:{reference:'【雪菜肉丝焖米粉】 https://www.bilibili.com/video/BV1tapQ6QEBg/?p=2',name:''}});
 let r=JSON.parse(a.saved.get('wokzy.personal.v1')).recipes[0];assert.equal(r.status,'draft');assert.equal(r.steps.length,0);
 assert.match(a.node('#overlay').innerHTML,/继续整理/);assert.doesNotMatch(a.node('#overlay').innerHTML,/data-action="start-cook"/);
 a.run("page='home';state.pantry=[{name:'米粉'}];renderCards()");assert.ok(!a.run("filteredRecipes().some(r=>r.id==='personal-test')"));
 const row=(values,kind)=>({querySelector:selector=>{const key=selector.match(/="([^"]+)"/)?.[1];return {value:values[key]||'',checked:false};}});
 const form={id:'recipe-form',dataset:{id:r.id},values:{name:r.name,servings:'2',sourceUrl:r.sourceUrl,sourceType:'参考网络整理',referenceTitle:'原视频标题',referenceAuthor:'宝哥',recipeNote:'下次调整口味'},querySelectorAll:selector=>selector==='.editor-ingredient'?[row({name:'米粉',category:'主料',amount:'',unit:''})]:[row({title:'焖煮',text:'自己记录的操作',tip:'自己总结的火候',timestamp:'02:35'})]};
 submit(form);r=JSON.parse(a.saved.get('wokzy.personal.v1')).recipes[0];assert.equal(r.status,'ready');assert.equal(r.steps[0].tip,'自己总结的火候');assert.equal(r.minutes,null);
 a.run("page='home';filter='all';renderCards()");assert.ok(a.run("filteredRecipes().some(r=>r.id==='personal-test')"));
 a.run("detail('personal-test');startCook()");assert.match(a.node('#overlay').innerHTML,/自己总结的火候/);assert.match(a.node('#overlay').innerHTML,/t=155/);assert.match(a.node('#overlay').innerHTML,/查看原视频/);
 a.run("editor('personal-test')");assert.match(a.node('#overlay').innerHTML,/自己总结的火候/);assert.match(a.node('#overlay').innerHTML,/02:35/);
 // A draft save must remain explicit, preserve notes/favorites, and stop obsolete cooking progress.
 a.run("state.favorites.push('personal-test');state.notes.push({recipeId:'personal-test',text:'做后心得'});");submit(form,'draft');
 r=JSON.parse(a.saved.get('wokzy.personal.v1'));assert.equal(r.recipes[0].status,'draft');assert.equal(r.cook,null);assert.ok(r.favorites.includes('personal-test'));assert.equal(r.notes[0].text,'做后心得');
 a.run("page='library';filter='draft';renderCards()");assert.equal(a.node('#recipe-count').textContent,'1 道');
});

test('既有菜谱独立要点完整进入编辑器，参考信息转义后显示',()=>{
 const a=app();a.run("editor(seedRecipes[0].id)");assert.match(a.node('#overlay').innerHTML,/data-step="tip"/);
 a.run("state.recipes.unshift({...structuredClone(seedRecipes[0]),id:'unsafe',sourceType:'原创',sourceUrl:'javascript:alert(1)',referenceTitle:'<script>x</script>'});detail('unsafe')");
 assert.doesNotMatch(a.node('#overlay').innerHTML,/href="javascript:/);
});
