// Append new catalog entries while keeping personal edits, notes and favorites.
export function mergeCatalog(saved,catalog){
 const byId=new Map(catalog.map(r=>[r.id,r]));
 const merged=saved.map(r=>{const incoming=byId.get(r.id);byId.delete(r.id);return incoming&&r.catalog&&!r.editedAt?structuredClone(incoming):r;});
 return [...merged,...structuredClone([...byId.values()])];
}
export function personalRecipes(recipes){return recipes.filter(r=>!r.catalog||r.editedAt);}
