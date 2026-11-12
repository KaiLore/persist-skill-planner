# Persist Online Skill Planner

Inoffizieller Community-Planner für Persist Online mit 25 Skillbäumen, Perks und einer Build-Übersicht. Deutsch und Englisch sind enthalten.

## Verwendung

Das gesamte Projekt herunterladen und entpacken. `Persist-Skill-Planner.html` im Browser öffnen; die Datei und der Ordner `assets/` müssen zusammenbleiben. Es ist keine Installation erforderlich.

Skills mit einem Klick erhöhen, mit Rechtsklick oder der Minustaste reduzieren. Builds lassen sich als JSON speichern und laden. Mit der Level-Sperre wird die Planung auf die gewählte Charakterstufe begrenzt.

Baumlevel und vergebene Skillpunkte sind unabhängig. Höhere Tiers werden durch das Baumlevel freigeschaltet; ein Klick plant die nötigen Badges automatisch ein. Ultimate benötigt Baumlevel 50 (sieben reguläre Badges und ein Ultimate Badge). Ways benötigen elf investierte Punkte im zugehörigen Skillzweig. Beim Zurücknehmen von Skillpunkten reduziert sich das geplante Baumlevel auf das für die übrigen Skills nötige Niveau.

## Build-Links

Beim Planen wird die URL ohne Neuladen aktualisiert. „URL kopieren“ unter den Build-Datei-Schaltflächen kopiert einen teilbaren Link. Enthalten sind Skillpunkte, Baumlevel, Perks, Charakterstufe, Level-Sperre, Rüstungsteile und Icon-Anzeige. Charakter- und Familienname werden nicht geteilt. Links sind Momentaufnahmen; für spätere Änderungen einen neuen Link kopieren. Ungültige Links ersetzen keine vorhandenen lokalen Builds. Die Daten stehen im URL-Fragment, es wird kein Speicherdienst benötigt. Offline erzeugte Links verweisen auf `https://persistplanner.com/`.

Das versionierte Linkformat verwendet stabile Baum- und Skill-IDs; die Sprache und Reihenfolge der Sprachdateien sind unabhängig davon. JSON-Dateien bleiben als zusätzliche Sicherung verfügbar.

## Entwicklung

Skill-Tooltips: Strg (englisch Ctrl) gedrückt halten, um die zum Skill passenden Statuseffekt-Erklärungen anzuzeigen. Beim Loslassen erscheint wieder der normale Tooltip. Die Zuordnung steht in `status-help.js`; Erklärungen und Bedienhinweise stehen übersetzbar in den Sprachdateien.

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

## Spielpatch 0.7.0.1 (Planner 0.14.6)

Sechs Best-Weapon-DPS-Skills verwenden jetzt höchste Basis-Waffen-DPS statt verstärkter Waffen-DPS. Waffenspezifische Boni wie Rückenstich, kritischer Schaden und Waffenspecial-Schaden gelten dafür nicht. Referenz und Beschreibungen in DE/EN korrigiert; Rangstaffeln unverändert. Quelle: vom Nutzer bereitgestellte Patchnotes.

## Spielpatch 0.7.0.5 (Planner 0.14.7)

Schadenswerte, Dauer, kritische Treffer und Way-Effekte der elf betroffenen Waffenbäume folgen den bereitgestellten Patchnotes. Bei Änderungen mit reinen Spannweiten sind Zwischenränge anhand der bisherigen Rangkurve geschätzt und mit `≈` markiert.

Der Spielpatch enthält außerdem neue Funktionen in der Knotenübersicht, zusätzliche Fraktionsquests ab Rang 5, Änderungen am Safehouse-Dashboard und dessen Benachrichtigungen sowie einen Fix für einen möglichen Client-Absturz.

## Spielpatches 0.7.0.6 und 0.7.0.7 (Planner 0.14.8)

0.7.0.6 vereinheitlicht den Angriffskegel von Nahkampfwaffen auf 90°. Direkte normale Nahkampf-Skillangriffe verwenden 3,5 m Reichweite und 90°. Hurricane Blade und Berserker Spirit verwenden 180°, Bringing the Pain 360°. Curare Curse verwendet mit Nahkampfwaffen 360°. Resurrection, No One Left Behind und Suppressive Fire haben 3,5 m Reichweite. Daten, Skilltexte und Detailanzeigen sind auf Deutsch und Englisch angepasst. Die Patchnotes nennen für die Ultimate-Winkel keine neue Reichweite. Titan Turret erhält laut Bugfix den Verwundbar-Schadensbonus von 25 %.

Weitere Spieländerungen in 0.7.0.6 sind die zentralere Position von Raine Kurokawa in Deadend sowie Fehlerbehebungen für Verbindungsabbrüche beim Wegwerfen von Scrap Parts in Sektorkämpfen, Client-Abstürze, ablaufende bereits erfüllte Fraktionsquests und Spielpost mit Anhängen.

0.7.0.7 verändert Gelände und ergänzt eine Baustellenruine. NPCs bieten verfügbare Dienste auch ohne Gesprächsthema an. Voice-over-Nachrichten erhalten Untertitel. Die Serverleistung ist verbessert. Im Safehouse ist die Charakterauswahl kompakter und zeigt den gewählten Charakter zuerst, Aufgaben behalten die Gegenstandsfilter, und der Abholton ist lauter. Fehlerbehebungen betreffen die Charakterplatzierung nach Safehouse-Resets, falsche Sitzungszeitüberschreitungen, Inventarlayouts und Hänger beim Öffnen der Einstellungen während des Ladens. Dieser Patch enthält keine neuen Skillwerte.

Quelle sind die vom Nutzer bereitgestellten Patchnotes.
