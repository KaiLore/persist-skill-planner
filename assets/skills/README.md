# Skillbilder

Verwendete Original-PNGs liegen direkt in diesem Ordner. Namen bestehen aus Baum, Position und englischem Skillnamen, z. B. `PistolsP1SkilledPistoleer.png`. `Ult`/`ULT` steht für Ultimate. Perks tragen `Perk` und ihre Nummer.

Gemeinsame transparente Auflagen heißen `OverlayEnhancerCooldown.png`, `OverlayEnhancerStamina.png`, `OverlayEnhancerImpact.png` und `OverlayLocked.png`. Die Ways verwenden `WaysSpecialisationIconAtlas.png`; ihre Rasterpositionen stehen in `data/planner-daten.json` unter `wayIcons`.

`manifest.json` enthält Bilddatei und Verwendung. Nicht verwendete Bilder liegen unter `unvergeben/`. Diese werden vom Planner nicht geladen.

PNG und Transparenz bleiben unverändert. Zum Ersetzen eines Bildes Dateiname beibehalten. Bei Umbenennungen Datenverweise anpassen und `build.py` ausführen. HTML und assets-Ordner zusammen behalten.
