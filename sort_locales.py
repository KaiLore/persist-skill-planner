"""Group flat format-2 translations without changing keys or translated values."""
from pathlib import Path
import json
import re
import sys


def organize(root, check=False):
    paths = sorted((root / 'locales').glob('*.json'))
    packs = [json.loads(f.read_text(encoding='utf-8')) for f in paths]
    base = next(pack for pack in packs if pack['code'] == 'de')['texts']
    for pack in packs:
        if set(pack['texts']) != set(base):
            raise ValueError('Language keys differ: ' + pack['code'])
    data = json.loads((root / 'data/planner-daten.json').read_text(encoding='utf-8'))
    template = (root / 'template.html').read_text(encoding='utf-8')
    app = (root / 'app.js').read_text(encoding='utf-8')
    blocks, used = [], set()

    def add(group, keys):
        keys = list(dict.fromkeys(k for k in keys if k in base and k not in used))
        if keys:
            used.update(keys)
            blocks.append((group, keys))

    def html_keys(source):
        return re.findall(r'data-i18n(?:-[a-z-]+)?="([A-Za-z0-9]+)"', source)

    def function_keys(name):
        match = re.search(r'^function ' + name + r'\(.*?(?=^function |\Z)', app, re.M | re.S)
        return re.findall(r"\b(?:T|H)\('([A-Za-z0-9]+)'", match[0]) if match else []

    header = template.split('<body>', 1)[1].split('<main', 1)[0]
    add('ui.header', html_keys(header.split('<nav', 1)[0]) + function_keys('renderBudget') + [
        'LevelLocked', 'LevelUnlimited', 'HintBadgeRegular', 'HintBadgeUltimate',
        'LabelBadgeRegular', 'LabelBadgeUltimate', 'BadgeRemaining', 'BadgeMissing',
        'PlanImpossible', 'PlanLevelDifference', 'WarnBuildPrerequisites'])
    add('ui.navigation', html_keys(header.split('<nav', 1)[-1]) +
        [t['categoryKey'] for t in data['trees']] + ['NavTreeCount'])
    for page, function in [('build', 'node'), ('overview', 'renderOverview'),
                           ('perks', 'renderPerks'), ('sources', None)]:
        start = template.index('<section id="' + page + '"')
        end = template.find('\n<section id=', start + 1)
        if end == -1:
            end = template.index('</main>', start)
        keys = html_keys(template[start:end])
        if function:
            keys += function_keys(function)
        if page == 'build':
            keys += ['TreeCount', 'ReqStart', 'ReqGate', 'ReqBase', 'ReqWay', 'ArmorScenario',
                     'BadgePlanned', 'BadgeExpanded', 'LabelBadgeRegularSingle', 'LabelBadgeUltimateSingle']
        if page == 'overview':
            keys += function_keys('passiveSummary')
        if page == 'perks':
            keys += [perk['nameKey'] for perk in data['perks']]
            keys += ['PerkAdd', 'PerkRemove', 'PerkPointCount', 'PartlyEstimated', 'StatusEstimated', 'SourceUserReadout']
        add('ui.' + page, keys)
    add('ui.tooltips', function_keys('showTip') + function_keys('effectiveValues') +
        [k for k in base if k.startswith('Kind')] + ['RankCount', 'RankDurationFor'])
    add('ui.footer', ['HintPlannerStatus'])
    add('ui.messages', [k for k in base if k.startswith(('Msg', 'Err', 'Warn', 'Default'))])

    # Data order matches the navigation; node order matches T0, T1/T2/T3 and Ultimate.
    for tree in data['trees']:
        group = 'tree.' + tree['id']
        add(group, [tree['nameKey']])
        for node in tree['nodes']:
            prefix = node['nameKey'].removesuffix('Name')
            keys = [node.get(k) for k in ('nameKey', 'descriptionKey', 'effectiveDescriptionKey')]
            keys += [prefix + suffix for suffix in ('Name', 'Desc', 'EffectiveDesc')]
            add(group, keys)
        prefixes = {n['nameKey'].split('T1')[0].split('P1')[0] for n in tree['nodes'][:1]}
        add(group, [k for k in base if any(k.startswith(prefix) for prefix in prefixes)])
        alias = 'Label' + tree['nameKey']
        add(group, [alias])

    for group, prefixes in [
        ('shared.weaponSpecials', ('Special', 'TitleWeaponSpecials', 'WeaponSpecialsSource')),
        ('shared.metrics', ('Metric',)), ('shared.facts', ('Fact',)),
        ('shared.effects', ('Effect', 'Debuff',)), ('shared.conditions', ('Condition',)),
        ('shared.targets', ('Target',)), ('shared.units', ('Unit',)),
        ('shared.rules', ('Rule', 'Patch', 'Poison', 'Note')),
        ('shared.other', ('',))]:
        add(group, sorted(k for k in base if k.startswith(prefixes)))
    ordered = [key for _, keys in blocks for key in keys]
    assert len(ordered) == len(base) and set(ordered) == set(base)
    labels = {
        'ui.header': ('Kopfbereich: Charakter, Build-Dateien, Stufe und Badges', 'Header: character, build files, level and badges'),
        'ui.navigation': ('Tabs und Kategorien', 'Tabs and categories'),
        'ui.build': ('Seite: Skillbäume und Baumsteuerung', 'Page: skill trees and tree controls'),
        'ui.overview': ('Seite: Build-Übersicht', 'Page: build overview'),
        'ui.perks': ('Seite: Perks in Tabellenreihenfolge', 'Page: perks in table order'),
        'ui.sources': ('Seite: Quellen, Regeln und Sprachdateien', 'Page: sources, rules and language files'),
        'ui.tooltips': ('Gemeinsame Skill-Tooltips', 'Shared skill tooltips'),
        'ui.footer': ('Fußzeile', 'Footer'), 'ui.messages': ('Rückmeldungen und Fehler', 'Feedback and errors'),
        'shared.weaponSpecials': ('Gemeinsame Waffenbesonderheiten', 'Shared weapon specials'),
        'shared.metrics': ('Wirkungswerte', 'Effect metrics'), 'shared.facts': ('Detailbeschriftungen', 'Detail labels'),
        'shared.effects': ('Effekte und Debuffs', 'Effects and debuffs'), 'shared.conditions': ('Bedingungen', 'Conditions'),
        'shared.targets': ('Ziele und Bezugsgrößen', 'Targets and reference values'),
        'shared.units': ('Einheiten', 'Units'), 'shared.rules': ('Weitere Regeln und Erklärungen', 'Other rules and explanations'),
        'shared.other': ('Weitere und historische Textschlüssel', 'Additional and legacy text keys')}
    tree_map = {t['id']: t for t in data['trees']}
    for path, pack in zip(paths, packs):
        texts = pack['texts']
        groups = []
        for group, keys in blocks:
            if groups and groups[-1]['id'] == group:
                groups[-1]['lastKey'] = keys[-1]
                continue
            title = (texts[tree_map[group[5:]]['nameKey']] if group.startswith('tree.')
                     else labels[group][0 if pack['code'] == 'de' else 1])
            groups.append({'id': group, 'title': title, 'firstKey': keys[0], 'lastKey': keys[-1]})
        # Blank lines separate pages, trees, and individual skills; JSON stays standard.
        metadata = {k: v for k, v in pack.items() if k not in ('texts', 'textGroups')}
        result = json.dumps(metadata, ensure_ascii=False, indent=2)[:-2]
        chunks = []
        for _, keys in blocks:
            chunks.append('\n'.join('    ' + json.dumps(k) + ': ' + json.dumps(texts[k], ensure_ascii=False) for k in keys))
        result += ',\n  "texts": {\n' + ',\n\n'.join(chunk.replace('\n', ',\n') for chunk in chunks) + '\n  },\n'
        result += '  "textGroups": ' + json.dumps(groups, ensure_ascii=False, indent=2).replace('\n', '\n  ') + '\n}\n'
        parsed = json.loads(result)
        assert parsed['texts'] == texts  # No translated value or key may change.
        if check:
            if path.read_text(encoding='utf-8') != result:
                raise ValueError('Run python sort_locales.py: ' + path.name)
        else:
            path.write_bytes(result.encode('utf-8'))
    return len(ordered), len(groups)


if __name__ == '__main__':
    count, groups = organize(Path(__file__).resolve().parent, '--check' in sys.argv)
    print(f'{count} keys in {groups} groups; language keys and values preserved.')
