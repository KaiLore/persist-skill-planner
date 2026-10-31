// Definitions are translation keys; aliases also recognize original in-game terms.
const STATUS_HELP=[
 ['confused','TreeConfusedName','TreeConfusedDesc',['Verwirrt','Confused']],
 ['crippled','TreeCrippledName','TreeCrippledDesc',['Verkrüppelt','Crippled']],
 ['disgusted','TreeDisgustedName','TreeDisgustedDesc',['Angewidert','Angeekelt','Disgusted','Nauseated']],
 ['neutralized','TreeNeutralizedName','TreeNeutralizedDesc',['Neutralisiert','Neutralized']],
 ['poisoned','TreePoisonedName','TreePoisonedDesc',['Vergiftet','Poisoned','Gift','Poison']],
 ['blinded','MetricBlinded','EffectBlinded',['Geblendet','Blinded']],
 ['distracted','EffectDistracted','EffectOutgoingDamagePenalty',['Abgelenkt','Distracted']],
 ['dazed','TreeDazedName','EffectDazedControls',['Benommen','Dazed']],
 ['traumatized','TreeTraumatizedName','EffectTraumatized',['Traumatisiert','Traumatized']],
 ['suppressed','EffectSuppressed','GlossarySuppressedDesc',['Unterdrückt','Suppressed']],
 ['bleeding','GlossaryBleedingName','GlossaryBleedingDesc',['Blutung','Blutungsdauer','Bleeding']],
 ['haste','GlossaryHasteName','GlossaryHasteDesc',['Eile','Haste']],
 ['vulnerable','TreeVulnerableName','TreeVulnerableDesc',['Verwundbar','Vulnerable']],
 ['stunned','EffectStunned','GlossaryStunnedDesc',['Betäubt','Stunned']],
 ['disarmed','GlossaryDisarmedName','GlossaryDisarmedDesc',['Entwaffnet','Disarmed']],
 ['slowed','GlossarySlowedName','TreeSlowedDesc',['Gelähmt','Slowed']],
 ['taunt','GlossaryTauntName','GlossaryTauntDesc',['Spott','Verspottet','Taunt','Taunts']],
 ['pacified','GlossaryPacifiedName','GlossaryPacifiedDesc',['Befriedet','Befriedung','Pacifies','Pacified','Pacification']],
 ['aggro','GlossaryAggroName','GlossaryAggroDesc',['Aggro']],
 ['npc','GlossaryNpcName','GlossaryNpcDesc',['Nicht-Spieler','Nicht-Spielern','Non-player','NPC','NPCs']],
 ['movementSpeed','GlossaryMoveSpeedName','GlossaryMoveSpeedDesc',['Bewegungsgeschwindigkeit','Movement speed']],
 ['slowingDebuffs','GlossarySlowingDebuffsName','GlossarySlowingDebuffsDesc',['Geschwindigkeitsreduzierende Debuffs','Movement-reducing debuffs']],
];
let controlHeld=false,activeTooltip=null;
function skillStatusText(n,text){return text+' '+(LANGUAGE_PACKS.find(pack=>pack.code==='de')?.texts[n.descriptionKey]||'');}
function relevantStatusHelp(text){
 const matches=(entry,source)=>{const [,nameKey,descriptionKey,aliases]=entry,plain=String(source).replace(/<[^>]*>/g,' ').toLocaleLowerCase();
  if(!T(descriptionKey).trim())return false;
  return [...aliases,T(nameKey)].some(term=>{
   const escaped=term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
   return new RegExp('(^|[^\\p{L}\\p{N}])'+escaped+'(?=$|[^\\p{L}\\p{N}])','iu').test(plain);
  });
 };const selected=new Set(STATUS_HELP.filter(entry=>matches(entry,text)).map(entry=>entry[0]));
 // Definitions may refer to other terms (for example slowing debuffs -> Slowed).
 let changed=true;while(changed){changed=false;const definitions=STATUS_HELP.filter(entry=>selected.has(entry[0])).map(entry=>T(entry[2])).join(' ');for(const entry of STATUS_HELP)if(!selected.has(entry[0])&&matches(entry,definitions)){selected.add(entry[0]);changed=true;}}
 return STATUS_HELP.filter(entry=>selected.has(entry[0]));
}
function statusHelpContent(entries){return '<strong>'+H('TitleStatusHelp')+'</strong><div class="status-help">'+entries.map(([,nameKey,descriptionKey])=>'<section><b>'+esc(T(nameKey))+'</b><p>'+richText(T(descriptionKey))+'</p></section>').join('')+'</div><small>'+H('HintStatusHelpRelease')+'</small>';}
function setControlHelp(pressed){if(controlHeld===pressed)return;controlHeld=pressed;if(activeTooltip)showTip(activeTooltip.button,activeTooltip.id);}
document.addEventListener?.('keydown',event=>{if(event.key==='Control'||event.ctrlKey)setControlHelp(true);});
document.addEventListener?.('keyup',event=>{if(event.key==='Control'||!event.ctrlKey)setControlHelp(false);});
document.defaultView?.addEventListener('blur',()=>{controlHeld=false;hideTip();});
