Trigger- och åtgärdskort med händelsenamn för avancerade flöden

Väldigt lättviktig app för att lägga till flera triggers med etiketter på ett enda flöde genom att lägga till ett händelsenamn. Flödena kan triggas med valfria argument. Lägg bara till ett triggerkort (När), sätt namnet och välj det i åtgärdskortet (Då). Eller lägg till ett åtgärdskort (Då), sätt namnet och välj det i triggerkortet (När).

Du kan använda överbelastning, vilket betyder: Ett 5-argument-när kort kan väljas och triggas med ett 1-argument-då kort.

Du kan också köa flöden så att de utförs efter varandra.

Det finns även flödeskort för att returnera värden, så du kan skapa metoder som kan återanvändas och hålla logiken i separata återanvändbara flöden.

Debounce kan ställas in på triggers (När-kort): vilket betyder att du kan hantera hur många gånger och på vilket sätt flöden körs inom en viss period.
- Utför den sista som väntar efter varje [antal av] ms.
- Utför vid start, tillåt sedan körning efter varje [antal av] ms.
- Utför vid start, tillåt sedan körning efter varje [antal av] ms, avsluta med den sista som väntar.

(Notera de extra förseningarna under testning i Avancerade flöden.)

Dessa kort körs nästan omedelbart, till skillnad från standard Start-A-Flow-korten som har en halv sekunds fördröjning.