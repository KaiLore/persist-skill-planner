from pathlib import Path
import json,re,html
p=Path(__file__).resolve().parent
d=json.loads((p/'data/planner-daten.json').read_text(encoding='utf-8'))
languages=[json.loads(f.read_text(encoding='utf-8')) for f in sorted((p/'locales').glob('*.json'))]
de=next(v['texts'] for v in languages if v['code']=='de')
params=lambda s: sorted(re.findall(r'\{([A-Za-z][A-Za-z0-9]*)\}',s))
for pack in languages:
    assert pack['schemaVersion']==2, 'Sprachformat 2 erforderlich'
    assert list(pack['texts'])==list(de), 'Sprachschlüssel oder Reihenfolge abweichend'
    for key,value in pack['texts'].items():
        assert re.fullmatch(r'[A-Za-z][A-Za-z0-9]*',key),key
        assert params(value)==params(de[key]), 'Platzhalter abweichend: '+key

def check_refs(value):
    if isinstance(value,str) and value.startswith('assets/skills/'):
        assert (p/value).is_file(), 'Bilddatei fehlt: '+value
    elif isinstance(value,list):
        for v in value:check_refs(v)
    elif isinstance(value,dict):
        for key,v in value.items():
            if key.endswith('Key') and isinstance(v,str):assert v in de,v
            elif key.endswith('Keys') and isinstance(v,list):
                for x in v:assert x in de,x
            else:check_refs(v)
for f in (p/'data').glob('*.json'):check_refs(json.loads(f.read_text()))
json_script=lambda value:json.dumps(value,ensure_ascii=False).replace('<','\\u003c')
s=(p/'template.html').read_text(encoding='utf-8')
s=s.replace('__DATA__',json_script(d)).replace('__ENGINE__',(p/'engine.js').read_text(encoding='utf-8')).replace('__I18N__',(p/'i18n.js').read_text(encoding='utf-8')).replace('__APP__',(p/'app.js').read_text(encoding='utf-8').replace('__LANGUAGES__',json_script(languages)))
s=re.sub(r'\{\{([A-Za-z][A-Za-z0-9]*)\}\}',lambda m:html.escape(de[m[1]],quote=True),s)
(p/'Persist-Skill-Planner.html').write_text(s,encoding='utf-8')
(p/'index.html').write_text(s,encoding='utf-8')
print('Offline-HTML mit externen Skillgrafiken erstellt; Sprachschlüssel, Platzhalter und Datenverweise geprüft.')
