Utløser- og handlingkort med hendelsesnavn for avanserte flyter

Veldig lett app for å legge til flere utløsere med merker på en enkelt flyt, ved å legge til et hendelsesnavn. Flytene kan utløses ved å bruke valgfrie argumenter. Bare legg til et utløserkort (Når), sett navnet, og velg det i handlingkortet (Da). Eller legg til et handlingkort (Da), sett navnet, og velg det i utløserkortet (Når).

Du kan bruke overbelastning, det betyr: Et 5-Argument-Når kort kan velges og utløses med et 1-Argument-Da kort.

Du kan også sette flyter i kø, slik at de vil kjøre etter hverandre.

Det finnes også flytkort for å returnere verdier, så du kan lage metoder som kan brukes igjen, og dermed holde logikken i separate gjenbrukbare flyter.

Debounce kan settes på utløserne (Når kort): dette betyr at du kan håndtere hvor mange ganger og på hvilken måte flyter blir kjørt innenfor en viss periode.
- Utfør den siste som venter etter hver [antall] ms.
- Utfør ved start, deretter tillate kjøring etter hver [antall] ms.
- Utfør ved start, deretter tillate kjøring etter hver [antall] ms, avslutt med den siste som venter.

(Vennligst merk de ekstra forsinkelsene under testing i avanserte flyter.)

Disse kortene utføres nesten umiddelbart, i motsetning til standard Start-En-Flyt kort som har et halvt sekund forsinkelse.