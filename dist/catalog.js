// Append new catalog entries while keeping personal edits, notes and favorites.
export function mergeCatalog(saved,catalog){
 const byId=new Map(catalog.map(r=>[r.id,r]));
 const merged=saved.map(r=>{const incoming=byId.get(r.id);byId.delete(r.id);return incoming&&r.catalog&&!r.editedAt?structuredClone(incoming):r;});
 return [...merged,...structuredClone([...byId.values()])];
}
export function personalRecipes(recipes){return recipes.filter(r=>!r.catalog||r.editedAt);}
export function recipeSource(recipe){
 if(recipe.catalog==='yunyoujun-cook')return recipe.editedAt?{id:'mine',label:'我的改编 · YunYouJun'}:{id:'yunyoujun',label:'YunYouJun'};
 if(recipe.sourceType==='示例菜谱'&&!recipe.editedAt)return {id:'sample',label:'Wokzy 示例'};
 return {id:'mine',label:recipe.editedAt&&recipe.originalSourceType==='示例菜谱'?'我的改编 · Wokzy':'我的'};
}
