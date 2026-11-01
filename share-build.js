// Versioned, bounded URL data. Stable IDs keep links independent of language/order.
function encodeBuildLink(build){
 const error=E.validate(build,true);if(error)throw Error(error);
 const trees=D.trees.flatMap(t=>{const points=t.nodes.filter(n=>build.points[t.id]?.[n.id]>0).map(n=>[n.id.slice(t.id.length+1),build.points[t.id][n.id]]);const cap=build.caps[t.id];return cap>10||points.length?[[t.id,cap,points]]:[];});
 const data=[1,build.characterLevel,!!build.levelLocked,build.armorPieces||7,build.iconMode||'rank',trees,D.perks.filter(p=>build.perks?.[p.id]>0).map(p=>[p.id,build.perks[p.id]])];
 return btoa(JSON.stringify(data)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function decodeBuildLink(encoded){
 const reject=()=>{throw Error('ErrBuildLink');};
 if(typeof encoded!=='string'||encoded.length>32768||!encoded.length||!/^[A-Za-z0-9_-]+$/.test(encoded))reject();
 let data;try{data=JSON.parse(atob(encoded.replace(/-/g,'+').replace(/_/g,'/')));}catch{reject();}
 if(!Array.isArray(data)||data.length!==7||data[0]!==1||typeof data[2]!=='boolean'||!Array.isArray(data[5])||data[5].length>D.trees.length||!Array.isArray(data[6])||data[6].length>D.perks.length)reject();
 const next=E.fresh();next.characterLevel=data[1];next.levelLocked=data[2];next.armorPieces=data[3];next.iconMode=data[4];const seenTrees=new Set(),seenPerks=new Set();
 for(const row of data[5]){
  if(!Array.isArray(row)||row.length!==3||typeof row[0]!=='string')reject();
  const tree=D.trees.find(t=>t.id===row[0]);if(!tree||seenTrees.has(tree.id)||!Array.isArray(row[2])||row[2].length>tree.nodes.length)reject();
  seenTrees.add(tree.id);next.caps[tree.id]=row[1];next.points[tree.id]={};const seenNodes=new Set();
  for(const point of row[2]){if(!Array.isArray(point)||point.length!==2||typeof point[0]!=='string')reject();const id=tree.id+'-'+point[0];if(!tree.nodes.some(n=>n.id===id)||seenNodes.has(id))reject();seenNodes.add(id);next.points[tree.id][id]=point[1];}
 }
 for(const row of data[6]){if(!Array.isArray(row)||row.length!==2||!D.perks.some(p=>p.id===row[0])||seenPerks.has(row[0]))reject();seenPerks.add(row[0]);next.perks[row[0]]=row[1];}
 return E.parse(next);
}
function buildShareURL(){const loc=globalThis.location,url=new URL(loc&&/^https?:$/.test(loc.protocol)?loc.origin+loc.pathname:'https://persistplanner.com/');url.hash='build='+encodeBuildLink(state);return url.href;}
function syncBuildURL(){if(!globalThis.location||!globalThis.history||!/^https?:$/.test(location.protocol))return;try{const next=buildShareURL();if(location.href!==next)history.replaceState(null,'',next);}catch{}$('shareurl').hidden=true;}
function loadSharedBuild(renderNow=false){
 const hash=globalThis.location?.hash||'';if(!hash.startsWith('#build='))return;
 try{const next=decodeBuildLink(hash.slice(7));state=next;current=D.trees.find(t=>Object.values(next.points[t.id]||{}).some(n=>n>0)||next.caps[t.id]>10)?.id||D.trees[0].id;selected='';feedbackMessage={key:'MsgBuildLinkLoaded',params:{}};remember();}
 catch{feedbackMessage={key:'MsgBuildLinkRejected',params:{}};}
 if(renderNow){hideTip();render();}
}
async function copyBuildURL(){
 try{const url=buildShareURL();try{if(!globalThis.navigator?.clipboard?.writeText)throw Error();await navigator.clipboard.writeText(url);$('shareurl').hidden=true;msg('MsgBuildURLCopied');}catch{const field=$('shareurl');field.value=url;field.hidden=false;field.focus?.();field.select?.();msg('MsgBuildURLManual');}}
 catch{msg('MsgBuildLinkRejected');}
}
