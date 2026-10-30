# Sprachdateien / Language files – Format 2

Alle Übersetzungen stehen weiterhin flach unter `texts`. Schlüssel, Platzhalter und Übersetzungen bleiben erhalten; vorhandene Format-2-Sprachdateien sind kompatibel. Alle Projektsprachen haben dieselbe logische Reihenfolge.

## Orientierung / Finding a text

Die Reihenfolge folgt dem Planner:

1. Kopfbereich: Sprache, Charakter, Build-Dateien, Charakterstufe und Badges.
2. Tabs und Kategorien der Navigation.
3. Skillbäume: Bedienelemente, Voraussetzungen und Bedienhinweise.
4. Build-Übersicht.
5. Perks: Bedienelemente und Namen in Tabellenreihenfolge.
6. Quellen & Regeln, einschließlich Sprachimport und -export.
7. Gemeinsame Tooltip-Texte, Fußzeile, Rückmeldungen und Fehler.
8. Die 25 Skillbäume in Navigationsreihenfolge: Fernkampf, Nahkampf, Berufe, Rüstung, Sonstiges.
9. Gemeinsame Waffenbesonderheiten, Wirkungswerte, Detailbeschriftungen, Effekte, Bedingungen, Ziele, Einheiten und weitere Regeln.

Leerzeilen trennen die Blöcke. Innerhalb eines Skillbaums folgen die Texte der Knotenreihenfolge: T0-Passiva, T1 mit Verstärkern und Ways, T2, T3, Ultimate. Pro Skill stehen Name, Beschreibung und gegebenenfalls die Beschreibung mit berechneten Werten direkt zusammen. Mehrfach verwendete Texte stehen nur einmal in der Datei.

Am Ende jeder JSON-Datei enthält `textGroups` ein Inhaltsverzeichnis: `title` benennt die Gruppe, `firstKey` und `lastKey` markieren ihren Anfang und ihr Ende unter `texts`. Suche im Editor nach diesen Schlüsseln. Diese optionale Orientierungshilfe wird nicht als Oberfläche angezeigt.

English: Texts follow page order, then the navigation order of the 25 trees. Each skill keeps its name, description and effective description together. Blank lines separate blocks. Use the `textGroups` table of contents at the end of the file to locate a group by its first and last key. Shared texts occur only once.

## Bearbeiten / Editing

Nur die Werte rechts unter `texts` übersetzen. Schlüssel und Platzhalter wie `{count}`, `{rank}`, `{name}` oder `{effect0}` erhalten. Platzhalter dürfen im übersetzten Satz in anderer Reihenfolge stehen. Keine Kommentare in die JSON-Datei einfügen.

Beispiel für einen Skillblock:

```json
"SkillShotgunT1Name": "Trigger Control",
"SkillShotgunT1Desc": "Skill description",
"SkillShotgunT1EffectiveDesc": "Deals {effect0} % damage."
```

## Sortieren und bauen / Sorting and building

Vom Projektordner aus:

```sh
python sort_locales.py
python sort_locales.py --check
python build.py
node test.cjs
```

`sort_locales.py` sortiert alle Sprachdateien identisch und aktualisiert ihre Gruppenübersicht. Es ändert keine Textwerte. `--check` prüft ohne Dateien zu schreiben. Auch `build.py` führt die Sortierung automatisch aus, bevor es `index.html` und `Persist-Skill-Planner.html` erzeugt. Neue bekannte Seitentexte und Skills werden aus Template, Anwendung und Planungsdaten zugeordnet; sonstige Schlüssel landen vollständig im gemeinsamen Schlussbereich.

English: Run `python sort_locales.py` to reorder all language files, or add `--check` to verify without writing. Building also sorts automatically. Translation values are preserved. Commit the changed language files and both generated HTML files together.

## Neue Sprache / New language

`de.json` oder `en.json` kopieren, `code` (z. B. `fr`) und `label` ändern und die Werte unter `texts` übersetzen. Die Datei in `locales/` legen und neu bauen. Alternativ lässt sich eine Sprachdatei direkt im Planner laden. Fehlende Schlüssel verwenden Deutsch als Fallback; unpassende Platzhalter und Format 1 werden beim Import abgewiesen. Für den Projekt-Build müssen alle Sprachdateien dieselben Schlüssel besitzen.

`textGroups` ist optional; alte Format-2-Dateien benötigen keine Anpassung. Die Übersicht darf beim Übersetzen weggelassen werden. Der Sortierer erzeugt sie erneut.

## Skill-Reworks und Schlüssel / Skill changes and keys

Skill-IDs in gespeicherten Builds ändern sich nicht. `nameKey`, `descriptionKey` und `effectiveDescriptionKey` verweisen auf die Texte eines Skills. Bei reinen Textänderungen nur die Sprachdateien bearbeiten. Zahlen, Ränge, Kosten und Voraussetzungen stehen in `data/planner-daten.json`; andere Daten-JSONs sind separate Dokumentations-/Exportstände.

- `Skill…Name`, `Skill…Desc`, `Skill…EffectiveDesc`: Name, Beschreibung, berechnete Beschreibung.
- `P1`, `P2` usw.: Passiva im T0-Bereich; `T1`, `T2`, `T3`: aktive Fähigkeiten; `Ult`: Ultimate.
- `Cooldown`, `Stamina`, `Impact`, `Way1`, `Way2`: Verstärker und Ways.
- `Title`, `Label`, `Btn`, `Tab`, `Hint`, `Rule`: Seitentexte und Bedienung.
- `Msg`, `Err`, `Warn`: Rückmeldungen, Fehler, Warnungen.
- `Metric`, `Fact`, `Effect`, `Condition`, `Target`, `Unit`: gemeinsame Wert- und Effektbezeichnungen.

Auch ältere, derzeit ungenutzte Schlüssel bleiben erhalten. Die Sortierung aktualisiert keine Spielwerte und entfernt keine Schlüssel.
