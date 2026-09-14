Trigger- en actiekaarten met eventnaam voor Geavanceerde Flows

Zeer lichte app voor het toevoegen van meerdere triggers met tags op een enkele flow, door het toevoegen van een eventnaam. De flows kunnen worden getriggerd met optionele argumenten. Voeg gewoon een triggerkaart toe (Wanneer), stel de naam in, en selecteer deze in de actiekaart (Dan). Of voeg een actiekaart toe (Dan), stel de naam in, en selecteer deze in de triggerkaart (Wanneer).

Je kunt overloading gebruiken, wat betekent: Een 5-Argument-Wanneer kaart kan geselecteerd en getriggerd worden met een 1-Argument-Dan kaart.

Je kunt ook flows in de rij zetten, zodat ze na elkaar worden uitgevoerd.

Er zijn ook flowkaarten om waarden terug te geven, zodat je methoden kunt maken die hergebruikt kunnen worden, waardoor de logica in afzonderlijke herbruikbare flows blijft.

Debounce kan worden ingesteld op triggers (Wanneer kaarten): hiermee kun je beheren hoe vaak en op welke manier flows binnen een bepaalde periode worden uitgevoerd.
- Voer de laatste wachtende uit na elke [aantal] ms.
- Voer bij de start uit, en sta vervolgens uitvoering toe na elke [aantal] ms.
- Voer bij de start uit, en sta vervolgens uitvoering toe na elke [aantal] ms, eindig met de laatste wachtende.

(Let op de extra vertragingen tijdens het testen in Geavanceerde Flows.)

Deze kaarten worden bijna onmiddellijk uitgevoerd, in tegenstelling tot de standaard Start-Een-Flow kaarten, die een halve seconde vertraging hebben.