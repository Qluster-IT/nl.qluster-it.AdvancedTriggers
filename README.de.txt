Auslöser- und Aktionskarten mit Ereignisname für Advanced Flows

Sehr leichte App zur Hinzufügung mehrerer Auslöser mit Tags in einem einzigen Flow, indem ein Ereignisname hinzugefügt wird. Die Flows können mit optionalen Argumenten ausgelöst werden. Einfach eine Auslöserkarte (Wenn) hinzufügen, den Namen festlegen und ihn in der Aktionskarte (Dann) auswählen. Oder eine Aktionskarte (Dann) hinzufügen, den Namen festlegen und sie in der Auslöserkarte (Wenn) auswählen.

Du kannst Overloading verwenden, was bedeutet: Eine 5-Argument-Wenn-Karte kann mit einer 1-Argument-Dann-Karte ausgewählt und ausgelöst werden.

Du kannst auch Flows in eine Warteschlange stellen, so dass sie nacheinander ausgeführt werden.

Es gibt auch Flowkarten, um Werte zurückzugeben, sodass du Methoden erstellen kannst, die wiederverwendet werden können, indem die Logik in separaten wiederverwendbaren Flows bleibt.

Bounce kann bei Auslösern (Wenn-Karten) eingestellt werden: Das bedeutet, du kannst steuern, wie oft und auf welche Weise Flows innerhalb eines bestimmten Zeitraums ausgeführt werden.
- Die letzte, die nach jeder [Anzahl] ms wartet, ausführen.
- Zu Beginn ausführen, dann nach jeder [Anzahl] ms die Ausführung erlauben.
- Zu Beginn ausführen, dann nach jeder [Anzahl] ms die Ausführung erlauben und mit der letzten, die wartet, beenden.

(Beachte bitte die zusätzlichen Verzögerungen während der Tests in Advanced Flows.)

Diese Karten werden fast sofort ausgeführt, im Gegensatz zu den standardmäßigen Start-A-Flow-Karten mit einer halben Sekunde Verzögerung.