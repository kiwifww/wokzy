export const aliases = { 西红柿:'番茄', 洋柿子:'番茄', 西蓝花:'西兰花', 青花菜:'西兰花', 生油:'食用油', 植物油:'食用油', 油:'食用油', 食盐:'盐', 大蒜:'蒜', 蒜头:'蒜', 葱花:'小葱', 葱:'小葱', 鲜香菇:'香菇', 米饭:'熟米饭', 剩米饭:'熟米饭', 猪肉末:'肉末' };
export const canonical = name => aliases[name.trim()] || name.trim();
export const displayAmount = (ingredient, servings, base) => ingredient.qty !== null && ingredient.qty !== undefined && ingredient.qty !== '' ? `${Math.round(Number(ingredient.qty) * servings / base * 100) / 100}${ingredient.unit || ''}` : (ingredient.amount || '适量');
const units = {克:['mass',1],g:['mass',1],千克:['mass',1000],kg:['mass',1000],毫升:['volume',1],ml:['volume',1],升:['volume',1000],L:['volume',1000]};
export function ingredientStatus(ingredient, pantry, servings, base) {
  const stock = pantry.find(p => canonical(p.name) === canonical(ingredient.name));
  if (!stock) return {kind:ingredient.optional ? 'optional' : 'missing',label:ingredient.optional ? '可选' : '还没有'};
  if (ingredient.qty === null || ingredient.qty === undefined || ingredient.qty === '' || !stock.qty || !stock.unit || !ingredient.unit) return {kind:'unknown',label:'用量待确认'};
  let quantity=Number(stock.qty);
  if (stock.unit !== ingredient.unit) {
    const a=units[stock.unit],b=units[ingredient.unit];
    if (!a || !b || a[0] !== b[0]) return {kind:'unknown',label:'用量待确认'};
    quantity=quantity*a[1]/b[1];
  }
  const required=Number(ingredient.qty)*servings/base;
  return quantity >= required ? {kind:'enough',label:'已备齐'} : {kind:'short',label:'数量不足',shortage:Math.round((required-quantity)*100)/100};
}
export function matchRecipe(recipe, pantry, servings=recipe.servings) {
  const items=recipe.ingredients.map(i=>({...i,status:ingredientStatus(i,pantry,servings,recipe.servings)}));
  const required=items.filter(i=>!i.optional);
  return {items,missing:required.filter(i=>i.status.kind==='missing'),short:required.filter(i=>i.status.kind==='short'),unknown:required.filter(i=>i.status.kind==='unknown'),mainMissing:required.filter(i=>i.category==='主料'&&i.status.kind==='missing').length,available:required.filter(i=>!['missing'].includes(i.status.kind)).length,ready:required.every(i=>!['missing','short'].includes(i.status.kind))};
}
export function sortRecipes(recipes,pantry) {
  return recipes.map(r=>({r,m:matchRecipe(r,pantry)})).sort(({r:a,m:x},{r:b,m:y})=>Number(y.ready)-Number(x.ready)||x.mainMissing-y.mainMissing||(x.missing.length+x.short.length)-(y.missing.length+y.short.length)||y.available-x.available||(a.minutes??Infinity)-(b.minutes??Infinity)).map(({r})=>r);
}
export function shoppingText(recipe,pantry,servings) {
  const m=matchRecipe(recipe,pantry,servings);
  const lines=m.items.filter(i=>!i.optional&&['missing','short'].includes(i.status.kind)).map(i=>`${i.name} ${i.status.kind==='short'?`${i.status.shortage}${i.unit}（需补充）`:displayAmount(i,servings,recipe.servings)}`);
  if(recipe.ingredientsComplete===false)return `${recipe.name} · 主料索引（完整配料和用量请核对原文）\n${lines.length?'待补充主料：\n'+lines.join('\n'):'索引中的主料已匹配。'}\n来源：${recipe.sourceUrl}`;
  return lines.length?`${recipe.name} · ${servings}人份\n待准备：\n${lines.join('\n')}`:`${recipe.name}：食材种类已列齐${m.unknown.length?'，部分用量仍需确认':''}。`;
}
