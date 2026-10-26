# Persist Online Skill Planner

Inoffizieller Community-Planner für Persist Online mit 25 Skillbäumen, Perks und einer Build-Übersicht. Deutsch und Englisch sind enthalten.

## Verwendung

Das gesamte Projekt herunterladen und entpacken. `Persist-Skill-Planner.html` im Browser öffnen; die Datei und der Ordner `assets/` müssen zusammenbleiben. Es ist keine Installation erforderlich.

Skills mit einem Klick erhöhen, mit Rechtsklick oder der Minustaste reduzieren. Builds lassen sich als JSON speichern und laden. Mit der Level-Sperre wird die Planung auf die gewählte Charakterstufe begrenzt.

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
