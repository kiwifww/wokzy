import test from 'node:test';
import assert from 'node:assert/strict';
import {parseReference,referenceLabel,referenceAt,timeSeconds,validatePersonalRecipe} from '../dist/personal-recipe.js';
test('保存整段分享文字中的原链接及标题，不捏造食材步骤',()=>{
 const ref=parseReference('【雪菜肉丝焖米粉食谱｜宝哥教你经典家常菜】 https://www.bilibili.com/video/BV1tapQ6QEBg/?share_source=copy_web');
 assert.equal(ref.title,'雪菜肉丝焖米粉食谱｜宝哥教你经典家常菜');assert.equal(referenceLabel(ref.url),'Bilibili');assert.match(ref.url,/share_source=copy_web/);
 assert.equal(referenceLabel('https://bilibili.com.evil.example'),'网页');
});
test('时间点保留视频原参数并转换到秒，拒绝异常时间及不安全链接',()=>{
 assert.equal(timeSeconds('02:35'),155);assert.equal(timeSeconds('01:02:35'),3755);
 const url=new URL(referenceAt('https://www.bilibili.com/video/BV1/?p=2','02:35'));assert.equal(url.searchParams.get('p'),'2');assert.equal(url.searchParams.get('t'),'155');
 assert.throws(()=>timeSeconds('02:99'));assert.equal(referenceAt('javascript:alert(1)',''), '');
});
test('草稿允许只存菜名链接，可做菜谱必须补齐食材步骤',()=>{
 const r={name:'焖米粉',sourceUrl:'https://www.bilibili.com/video/BV1/',ingredients:[],steps:[],status:'draft'};
 assert.equal(validatePersonalRecipe(r),r);assert.throws(()=>validatePersonalRecipe({...r,status:'ready'}));
 assert.throws(()=>validatePersonalRecipe({...r,steps:[{text:'',tip:'火候要点'}]}));
});
