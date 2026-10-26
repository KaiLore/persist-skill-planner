# Sprachdateien – Format 2

DE und EN nutzen dieselben benannten Schlüssel in identischer alphabetischer Reihenfolge. Alle Texte stehen flach unter `texts`; keine deutschen Ausgangssätze als Schlüssel und keine zusätzliche `skills`-Sektion.

```json
{
  "schemaVersion": 2,
  "code": "de",
  "label": "Deutsch",
  "texts": {
    "BadgeRemaining": "{count} frei",
    "SkillShotgunT1Desc": "Beschreibung des Grundskills",
    "SkillShotgunT1Name": "Trigger Control",
    "TitleCharPlanner": "Charakter & Skill Planner"
  }
}
```

## Bearbeiten

Nur die Werte rechts ändern. Schlüssel und Platzhalter wie `{count}`, `{rank}` oder `{name}` erhalten. Platzhalter dürfen in anderer Reihenfolge stehen. Englische Skillnamen und Beschreibungen bleiben bis zur Prüfung deutsche Platzhalter.

## Neue Sprache

`de.json` kopieren, `code` (z. B. `fr`) und `label` ändern und Werte übersetzen. Die Datei in `locales/` legen und `python3 build.py` ausführen. Oder eine Sprachdatei direkt im Planner laden. Fehlende Schlüssel verwenden DE als Fallback. Unpassende Platzhalter und das bisherige Format 1 werden beim Import abgewiesen. Alte Dateien müssen auf die neuen Schlüssel übertragen werden.

## Skill-Reworks

Skill-IDs in Builds ändern sich nicht. `nameKey` und `descriptionKey` eines Skills zeigen auf die Sprachdatei, beispielsweise `SkillShotgunT1Name` und `SkillShotgunT1Desc`. Bei einem reinen Text-Rework diese beiden Werte in DE und EN ändern; UI-Code und gespeicherte Builds bleiben unverändert. Für geänderte Zahlen, Ränge, Kosten oder Voraussetzungen zusätzlich `data/planner-daten.json` anpassen. Andere Daten-JSONs sind separate Dokumentations-/Exportstände.

## Namensschema

- `Title…`, `Label…`, `Btn…`, `Tab…`: Überschriften, Beschriftungen, Schaltflächen und Tabs.
- `Msg…`, `Err…`, `Hint…`, `Req…`: Meldungen, Fehler, Hinweise und Voraussetzungen.
- `Tree…`, `Category…`, `Kind…`, `Perk…`: Bäume, Kategorien, Typen und Perks.
- `Skill{Baum}{Position}Name/Desc`: Skillname und Beschreibung. `P1` = erstes Passiv, `T1` = erste aktive Fähigkeit; `Cooldown`, `Stamina`, `Impact`, `Way1/Way2` = zugehörige Erweiterungen.
- `Metric…`, `Fact…`, `Unit…`, `Status…`, `Issue…`, `Note…`, `Rule…`, `Source…`, `Condition…`, `Effect…`, `Target…`: Effektbezeichnungen, Wertebeschriftungen, Einheiten, Datenstatus und Referenztexte.

Lange gemeinsame Erklärungen werden nur einmal pro Sprachdatei gespeichert. Schlüssel werden nicht bei Änderungen ihres Textwerts neu erzeugt.

Schlüssel sind kurze englische PascalCase-Bezeichner nach ihrer Funktion, keine aus Sätzen erzeugten Namen. Beispiele: `IssueVariablesNotTranslated`, `MetricStaminaCost`, `PerkCritChanceName`. DE und EN bleiben alphabetisch gleich sortiert.
