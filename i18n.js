(function(g){'use strict';
function createI18n(packs,code='de'){
 const catalog=Object.fromEntries(packs.map(p=>[p.code,p]));let current=catalog[code]?code:'de';
 const placeholders=s=>[...String(s).matchAll(/\{([A-Za-z][A-Za-z0-9]*)\}/g)].map(x=>x[1]).sort().join('|');
 function check(p){if(!p||p.schemaVersion!==2||!/^([a-z]{2,3})(-[A-Za-z0-9]{2,8})*$/.test(p.code)||typeof p.label!=='string'||p.label.length>80||!p.texts||Array.isArray(p.texts)||typeof p.texts!=='object')throw Error('ErrLanguageFormat');for(const [k,v] of Object.entries(p.texts)){if(!/^[A-Za-z][A-Za-z0-9]*$/.test(k)||typeof v!=='string'||v.length>100000)throw Error('ErrLanguageFormat');const base=catalog.de.texts[k];if(base!==undefined&&placeholders(v)!==placeholders(base))throw Error('ErrLanguagePlaceholders');}return p;}
 function t(key,params={}){const value=catalog[current]?.texts[key]??catalog.de?.texts[key]??'['+key+']';return value.replace(/\{([A-Za-z][A-Za-z0-9]*)\}/g,(m,k)=>Object.hasOwn(params,k)?String(params[k]):m);}
 function resolve(value){if(Array.isArray(value))return value.map(resolve);if(!value||typeof value!=='object')return value;const out={};for(const [k,v] of Object.entries(value))out[k]=resolve(v);for(const [k,v] of Object.entries(value)){if(k.endsWith('Keys')&&Array.isArray(v))out[k.slice(0,-4)]=v.map(key=>t(key));else if(k.endsWith('Key')&&typeof v==='string'){const field=k.slice(0,-3);if(!['kind','category'].includes(field))out[field]=t(v);}}return out;}
 return {t,check,resolve,catalog,get code(){return current;},setCode(code){if(!catalog[code])throw Error('ErrLanguageFormat');current=code;},install(p){check(p);catalog[p.code]=p;current=p.code;}};
}
g.createI18n=createI18n;
})(globalThis);
