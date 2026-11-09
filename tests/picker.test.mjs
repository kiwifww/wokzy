import test from 'node:test';
import assert from 'node:assert/strict';
import {ingredientGroups,togglePantryIngredient,relatedRecipes} from '../dist/picker.js';
import {seedRecipes} from '../dist/data.js';
import {canonical} from '../dist/core.js';
test('点击食材只更改这一项，其他库存数量不受影响，别名不会产生重复',()=>{
 const salt={name:'盐',qty:30,unit:'克',staple:true};
 const original=[salt];const added=togglePantryIngredient(original,'西红柿');
 assert.deepEqual(added,[salt,{name:'番茄',qty:null,unit:'',staple:false}]);assert.equal(added[0],salt);assert.equal(original.length,1);
 assert.deepEqual(togglePantryIngredient(added,'番茄'),original);
 assert.equal(togglePantryIngredient([],'生抽',true)[0].staple,true);
 assert.equal(canonical('constructor'),'constructor');
});
test('仅有调料或未点选时不给出无关菜谱，主料匹配不把所有调料当作食材相关性',()=>{
 assert.deepEqual(relatedRecipes(seedRecipes,[]),[]);
 assert.deepEqual(relatedRecipes(seedRecipes,[{name:'盐',staple:true}]),[]);
 const matches=relatedRecipes(seedRecipes,[{name:'西红柿',staple:false}]);
 assert.ok(matches.length>0);assert.ok(matches.every(r=>r.ingredients.some(i=>canonical(i.name)==='番茄')));
});
test('选择项分组无重复、全是名称数据且不依赖 emoji',()=>{
 assert.equal(ingredientGroups.length,4);
 for(const group of ingredientGroups){assert.equal(new Set(group.items.map(i=>i.name)).size,group.items.length);assert.ok(group.items.every(i=>i.name&&!('emoji' in i)));}
 assert.ok(ingredientGroups.find(g=>g.id==='staple').items.some(i=>i.name==='熟米饭'));
});
