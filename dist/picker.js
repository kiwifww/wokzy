import {canonical} from './core.js';
import {ingredientGroups} from './ingredient-options.js';
export {ingredientGroups};
export function togglePantryIngredient(pantry,name,staple=false){
 const key=canonical(name);
 return pantry.some(p=>canonical(p.name)===key)?pantry.filter(p=>canonical(p.name)!==key):[...pantry,{name:key,qty:null,unit:'',staple}];
}
export function relatedRecipes(recipes,pantry){
 const names=new Set(pantry.filter(p=>!p.staple).map(p=>canonical(p.name)));
 if(!names.size)return [];
 return recipes.filter(r=>r.ingredients.some(i=>i.category!=='调料'&&names.has(canonical(i.name))));
}
