(function(g){'use strict';
g.createPlanner=function(D,translate=(key)=>key){
 const fail=(key,params={})=>translate(key,params);
 const ts=Object.fromEntries(D.trees.map(t=>[t.id,t]));
 const sum=p=>Object.values(p).reduce((a,b)=>a+b,0);
 function fresh(){return {schemaVersion:4,characterLevel:1,levelLocked:false,characterName:'',familyName:'',caps:Object.fromEntries(D.trees.map(t=>[t.id,10])),points:{},completed:{},perks:{}};}
 function earned(level){const ultimate=[45,55,65,75,85].filter(x=>x<=level).length;return [Math.max(0,level-9)-ultimate,ultimate];}
 function usage(s){return [Object.values(s.caps).reduce((a,cap)=>a+(Math.min(cap,45)-10)/5,0),Object.values(s.caps).filter(cap=>cap===50).length];}
 function requiredLevel(badges){if(badges[1]>5)return null;for(let level=1;level<=1000;level++){const e=earned(level);if(e.every((v,i)=>v>=badges[i]))return level;}return null;}
 function treeUsage(cap){return [(Math.min(cap,45)-10)/5,cap===50?1:0];}
 function perkPoints(level){return level<10?0:1+Math.floor((level-10)/5);}
 function perkRequired(s){const used=sum(s.perks||{});return used?10+(used-1)*5:1;}
 function perkTotal(id,rank){return D.perks.find(p=>p.id===id).increments.slice(0,rank).reduce((a,b)=>a+b,0);}
 function planLevel(s){const badge=requiredLevel(usage(s));return badge===null?null:Math.max(badge,perkRequired(s));}
 function invalidSkills(s,tree){
  const t=ts[tree],p=s.points[tree]||{};
  const pending=t.nodes.filter(n=>p[n.id]>0),bought={};let progress=true;
  while(pending.length&&progress){progress=false;for(let i=pending.length-1;i>=0;i--){const n=pending[i];
   if(n.parent){if(!bought[n.parent])continue;if(n.kind==='Way'&&t.nodes.filter(x=>x.id===n.parent||(x.parent===n.parent&&x.kind==='Enhancer')).reduce((a,x)=>a+(bought[x.id]||0),0)<11)continue;}
   else if(s.caps[tree]<(n.kind==='Ultimate'?50:n.gate))continue;
   bought[n.id]=p[n.id];pending.splice(i,1);progress=true;
  }}
  return pending.map(n=>n.id);
 }
 function validate(s,allowUnmet=false){
  if(s?.schemaVersion!==4||!Number.isInteger(s.characterLevel)||s.characterLevel<1||s.characterLevel>1000)return fail('ErrCharFormat');
  if(s.perks!==undefined&&(s.perks===null||typeof s.perks!=='object'||Array.isArray(s.perks)||Object.entries(s.perks).some(([id,rank])=>!D.perks.some(p=>p.id===id)||!Number.isInteger(rank)||rank<0||rank>3)))return fail('ErrPerkDistribution');
  for(const key of ['characterName','familyName'])if(s[key]!==undefined&&(typeof s[key]!=='string'||s[key].length>80))return fail('ErrNames');
  if(s.levelLocked!==undefined&&typeof s.levelLocked!=='boolean')return fail('ErrLevelLock');
  if(s.armorPieces!==undefined&&(!Number.isInteger(s.armorPieces)||s.armorPieces<1||s.armorPieces>7))return fail('ErrArmorCount');
  if(s.iconMode!==undefined&&!['rank','locked','unlocked'].includes(s.iconMode))return fail('ErrIconMode');
  if(!s.caps||typeof s.caps!=='object'||Array.isArray(s.caps)||Object.keys(s.caps).length!==D.trees.length)return fail('ErrTreeBudgets');
  if(!s.points||typeof s.points!=='object'||Array.isArray(s.points))return fail('ErrPointList');
  if(Object.keys(s.points).some(id=>!Object.hasOwn(ts,id)))return fail('ErrUnknownTree');
  for(const [id,cap] of Object.entries(s.caps))if(!Object.hasOwn(ts,id)||!Number.isInteger(cap)||cap<10||cap>50||cap%5)return fail('ErrTreeBudgetRange');
  for(const t of D.trees){
   const p=s.points[t.id]||{},map=Object.fromEntries(t.nodes.map(n=>[n.id,n]));
   if(typeof p!=='object'||Array.isArray(p))return fail('ErrTreePoints',{tree:t.name});
   for(const [id,n] of Object.entries(p))if(!Object.hasOwn(map,id)||!Number.isInteger(n)||n<0||n>map[id].max)return fail('ErrSkillRank',{tree:t.name});
   if(sum(p)>s.caps[t.id])return fail('ErrTooManyPoints',{tree:t.name});
   for(const base of t.nodes.filter(n=>n.kind==='Aktiv'))if(t.nodes.filter(n=>n.parent===base.id&&n.kind==='Way'&&p[n.id]>0).length>1)return fail('ErrSingleWay');
   const invalid=invalidSkills(s,t.id);if(!allowUnmet&&invalid.length)return fail('ErrSkillGate',{tree:t.name,skill:map[invalid[0]].name});
  }
  if(s.levelLocked){const used=usage(s),available=earned(s.characterLevel);if(used.some((v,i)=>v>available[i]))return fail('ErrBadgeBudget');if(sum(s.perks||{})>perkPoints(s.characterLevel))return fail('ErrPerkBudget');}
  return '';
 }
 function change(s,tree,id,delta){const next=JSON.parse(JSON.stringify(s));const t=ts[tree],n=t?.nodes.find(x=>x.id===id);if(!n)return {error:fail('ErrUnknownSkill')};const p=next.points[tree]||={};p[id]=(p[id]||0)+delta;
  if(n.kind==='Way'&&delta>0)for(const x of t.nodes)if(x.kind==='Way'&&x.parent===n.parent&&x.id!==id)p[x.id]=0;
  const previousCap=next.caps[tree],base=n.parent?t.nodes.find(x=>x.id===n.parent):n;
  if(delta>0)next.caps[tree]=Math.max(previousCap,10,Math.ceil(sum(p)/5)*5,base.kind==='Ultimate'?50:Math.ceil((base.gate||0)/5)*5);
  if(delta<0)next.caps[tree]=Math.max(10,Math.ceil(sum(p)/5)*5,...t.nodes.filter(x=>p[x.id]>0).map(x=>{const root=x.parent?t.nodes.find(y=>y.id===x.parent):x;return root.kind==='Ultimate'?50:Math.ceil((root.gate||0)/5)*5;}));
  let error=validate(next,true);if(!error&&delta>0){const before=invalidSkills(s,tree),after=invalidSkills(next,tree);if(after.includes(id)||after.some(x=>!before.includes(x)))error=fail('ErrSkillGate',{tree:t.name,skill:n.name});}return error?{error}:{state:next,badge:next.caps[tree]>previousCap?{kind:next.caps[tree]===50?'ultimate':'regular',from:previousCap,to:next.caps[tree]}:null};}
 function effectiveSkill(s,tree,id){
  const t=ts[tree],n=t?.nodes.find(x=>x.id===id);if(!n)return null;
  const points=s.points[tree]||{},pieces=s.armorPieces||7,impact=t.nodes.find(x=>x.parent===id&&x.kind==='Enhancer'&&x.id.endsWith('-IMP')),impactRank=points[impact?.id]||0;
  const rows=(skillId,rank)=>t.levels.filter(v=>v.skillId===skillId&&v.rank===rank&&(v.armorPieces===undefined||v.armorPieces===pieces));
  const selected=impactRank?rows(impact.id,impactRank):[],baseRows=rows(id,Math.max(1,points[id]||0)),params={},values=[];
  for(const rule of n.effectiveEffects||[]){let base=rule.baseMetricKey?baseRows.find(v=>v.metricKey===rule.baseMetricKey)?.value:rule.base;const row=selected.find(v=>v.metricKey===rule.metricKey);let value=row?row.value:base;
   if(row&&rule.mode==='add')value=base===undefined||base===null?null:base+row.value;
   params[rule.slot]=value;values.push({...rule,value,base,enhanced:!!row,missing:impactRank>0&&!row,sourceStatusKey:row?.statusKey});
  }
  for(const suffix of ['CD','STA']){const child=t.nodes.find(x=>x.parent===id&&x.id.endsWith('-'+suffix)),rank=points[child?.id]||0;const row=rank&&child?rows(child.id,rank)[0]:null,base=n.details?.[suffix==='CD'?'baseCooldownSeconds':'baseStaminaCost'];if(row||base!==undefined)values.push({metricKey:suffix==='CD'?'MetricCooldown':'MetricStaminaCost',value:row?row.value:base,base,unit:row?.unit||(suffix==='CD'?'s':''),unitKey:row?.unitKey,enhanced:!!row});}
  for(const row of baseRows)if((row.armorPieces!==undefined||n.kind==='Ultimate')&&!values.some(v=>v.metricKey===row.metricKey||v.baseMetricKey===row.metricKey))values.push({...row,enhanced:false});
  return {params,values,impactRank,missingImpact:impactRank>0&&(n.effectiveEffectsMissing||values.some(v=>v.missing))};
 }
 function buildFilename(s){const clean=value=>String(value||'').normalize('NFC').replace(/[<>:"/\\|?*\u0000-\u001f\u007f]/g,'-').trim().replace(/[. ]+$/g,'').replace(/^-+|-+$/g,'');const character=clean(s.characterName)||fail('DefaultCharName'),family=clean(s.familyName);let name=family?family+'-'+character:character;if(/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(name))name='_'+name;return name+'.json';}
 function parse(raw){raw=JSON.parse(JSON.stringify(raw));if(raw?.perks&&Object.hasOwn(raw.perks,'PERK-15')&&Number.isInteger(raw.perks['PERK-15'])&&raw.perks['PERK-15']>=0&&raw.perks['PERK-15']<=3)delete raw.perks['PERK-15'];const e=validate(raw,true);if(e)throw Error(e);return JSON.parse(JSON.stringify(raw));}
 return {invalidSkills,fresh,sum,earned,usage,requiredLevel,treeUsage,perkPoints,perkRequired,perkTotal,planLevel,validate,change,parse,buildFilename,effectiveSkill};
};})(globalThis);
