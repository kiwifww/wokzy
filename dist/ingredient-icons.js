import {canonical} from './core.js';

// Only fixed asset names are ever interpolated into markup. Unknown user input
// gets a neutral ingredient packet rather than a guessed food or missing glyph.
export const ingredientIcons=Object.freeze({
 番茄:'tomato',圣女果:'tomato',鸡蛋:'egg',鸭蛋:'egg',鹌鹑蛋:'egg',西兰花:'broccoli',
 蒜:'garlic',香菇:'mushroom',蘑菇:'mushroom',口蘑:'mushroom',杏鲍菇:'mushroom',
 鸡腿肉:'chicken',鸡腿:'chicken',鸡胸肉:'chicken',鸡肉:'chicken',鸡翅:'chicken',
 豆腐:'tofu',嫩豆腐:'tofu',老豆腐:'tofu',小葱:'scallion',大葱:'scallion',香葱:'scallion',
 熟米饭:'rice',大米:'rice',糯米:'rice',紫菜:'seaweed',海苔:'seaweed',海带:'seaweed',
 肉末:'mince',牛肉末:'mince',盐:'salt',食用油:'oil',花生油:'oil',菜籽油:'oil',橄榄油:'oil',
 姜:'ginger',生姜:'ginger',白糖:'sugar',糖:'sugar',冰糖:'sugar',砂糖:'sugar',
 生抽:'soy',老抽:'soy',酱油:'soy',淀粉:'starch',玉米淀粉:'starch',面粉:'starch',
 香油:'sesameOil',芝麻油:'sesameOil',豆瓣酱:'beanPaste',郫县豆瓣酱:'beanPaste',
 花椒粉:'pepper',胡椒粉:'pepper',黑胡椒:'pepper',白胡椒粉:'pepper',花椒:'pepper',
 胡萝卜:'carrot',红萝卜:'carrot',洋葱:'onion',土豆:'potato',马铃薯:'potato',
 白菜:'cabbage',大白菜:'cabbage',包菜:'cabbage',卷心菜:'cabbage',圆白菜:'cabbage',
 黄瓜:'cucumber',青瓜:'cucumber',青菜:'greens',小白菜:'greens',油菜:'greens',菠菜:'greens',生菜:'greens',
 鱼:'fish',鱼肉:'fish',鲈鱼:'fish',鲫鱼:'fish',鳕鱼:'fish',虾:'shrimp',虾仁:'shrimp',鲜虾:'shrimp',
 牛肉:'beef',牛腩:'beef',猪肉:'pork',瘦肉:'pork',五花肉:'pork',青椒:'pepperVegetable',彩椒:'pepperVegetable',甜椒:'pepperVegetable'
});
export function ingredientAsset(name){const key=canonical(String(name||''));return `assets/ingredients/${Object.hasOwn(ingredientIcons,key)?ingredientIcons[key]:'generic'}.png`;}
export function dishAsset(recipe){
 const tags=recipe.tags||[];
 if(tags.includes('汤羹')||/汤/.test(recipe.name||''))return 'assets/ingredients/pot.png';
 if(tags.includes('主食')||/饭|粥/.test(recipe.name||''))return 'assets/ingredients/rice.png';
 return ingredientAsset(recipe.ingredients?.find(i=>i.category==='主料')?.name);
}
export function ingredientImage(name){return `<img class="pixel-icon" src="${ingredientAsset(name)}" alt="" aria-hidden="true" width="24" height="24">`;}
export function dishImage(recipe){return `<img class="pixel-icon" src="${dishAsset(recipe)}" alt="" aria-hidden="true" width="24" height="24">`;}
