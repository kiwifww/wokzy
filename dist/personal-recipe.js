export function parseReference(value){
 const text=String(value||'').trim();
 const url=text.match(/https?:\/\/[^\s<>]+/)?.[0]?.replace(/[，。；）】]+$/,'')||'';
 const title=text.match(/【([^】]+)】/)?.[1]||'';
 return {url,title};
}
export function referenceLabel(value){try{const host=new URL(value).hostname;return /(^|\.)bilibili\.com$|(^|\.)b23\.tv$/.test(host)?'Bilibili':'网页';}catch{return '';}}
export function timeSeconds(value){
 if(!value)return null;
 if(!/^\d{1,3}:[0-5]\d(?::[0-5]\d)?$/.test(value))throw new Error('视频时间点请填写 mm:ss 或 hh:mm:ss，例如 02:35。');
 return value.split(':').reduce((sum,n)=>sum*60+Number(n),0);
}
export function referenceAt(value,timestamp){
 try{const url=new URL(value);if(!['http:','https:'].includes(url.protocol))return '';const seconds=timeSeconds(timestamp);if(seconds!==null&&referenceLabel(value)==='Bilibili')url.searchParams.set('t',seconds);return url.href;}catch{return '';}
}
export function validatePersonalRecipe(r){
 if(!r.name.trim())throw new Error('先给这道菜起个名字。');
 if(r.sourceUrl&&!referenceAt(r.sourceUrl,''))throw new Error('参考链接需以 https:// 或 http:// 开头。');
 if(r.status!=='draft'&&(!r.ingredients.length||!r.steps.length))throw new Error('保存为可做菜谱前，请补充食材和至少一个步骤；也可以先存为待整理。');
 for(const s of r.steps){if(!s.text.trim())throw new Error('请补充步骤内容，或移除空步骤。');timeSeconds(s.timestamp||'');}
 return r;
}
