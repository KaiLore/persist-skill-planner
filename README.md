# Persist Online Skill Planner

Inoffizieller Community-Planner für Persist Online mit 25 Skillbäumen, Perks und einer Build-Übersicht. Deutsch und Englisch sind enthalten.

## Verwendung

Das gesamte Projekt herunterladen und entpacken. `Persist-Skill-Planner.html` im Browser öffnen; die Datei und der Ordner `assets/` müssen zusammenbleiben. Es ist keine Installation erforderlich.

Skills mit einem Klick erhöhen, mit Rechtsklick oder der Minustaste reduzieren. Builds lassen sich als JSON speichern und laden. Mit der Level-Sperre wird die Planung auf die gewählte Charakterstufe begrenzt.

Baumlevel und vergebene Skillpunkte sind unabhängig. Höhere Tiers werden durch das Baumlevel freigeschaltet; ein Klick plant die nötigen Badges automatisch ein. Ultimate benötigt Baumlevel 50 (sieben reguläre Badges und ein Ultimate Badge). Ways benötigen elf investierte Punkte im zugehörigen Skillzweig. Beim Zurücknehmen von Skillpunkten reduziert sich das geplante Baumlevel auf das für die übrigen Skills nötige Niveau.

## Entwicklung

`data/planner-daten.json` enthält die Planungsdaten. Sprachdateien liegen in `locales/`, Grafiken in `assets/skills/`. `engine.js` enthält die Planungsregeln, `app.js` und `template.html` die Oberfläche.

Nach Änderungen mit Python 3 neu bauen und mit Node.js testen:

```sh
python build.py
node test.cjs
```

Weitere Sprachen und das Sprachformat sind in `locales/README.md` beschrieben. Hinweise zu den Grafiken stehen in `assets/skills/README.md`.

## Quellen

Grundlage: Skill Planner 1.0 von Avalon [Westwood] (NA), 05.05.2026. Skillwerte aus Spiel-Tooltips und Spielbeobachtungen vom Oktober 2026. Persist Online befindet sich in Entwicklung; Spielwerte können sich ändern. Spielgrafiken und Spielbezeichnungen gehören ihren jeweiligen Rechteinhabern.

## Spielpatch 0.7.0.0 (Planner 0.14.5)

Entfernten Rückstoß-Perk aus der Auswahl genommen; Originalgrafik unter assets/skills/unvergeben/ erhalten. Alte Build-Importe geben seine geplanten Perk-Punkte mit Hinweis frei. Veraltete Rückstoß-Statwerte entfernt; Genauigkeits-Ersatzwerte bleiben bis zur Tooltip-Prüfung offen. Waffen-Zurückstoßen ist eine eigenständige Eigenschaft. Neue Kampfregeln und Badge-Rückgabe stehen unter Quellen und Regeln. Bestätigte Skillwerte und Freischaltregeln bleiben unverändert. Kein vollständiger Schadensrechner.
