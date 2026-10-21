Udløser- og handlingskort med eventnavn til Avancerede Flows

Meget let app til at tilføje flere triggere med tags på en enkelt flow ved at tilføje et eventnavn. Flowene kan trigges ved hjælp af valgfrie argumenter. Bare tilføj et triggerkort (Når), sæt navnet, og vælg det i handlingskortet (Så). Eller tilføj et handlingskort (Så), sæt navnet, og vælg det i triggerkortet (Når).

Du kan bruge overbelastning, hvilket betyder: Et 5-Argument-Når kort kan vælges og trigges med et 1-Argument-Så kort.

Du kan også køe flows, så de vil blive udført efter hinanden.

Der er også flowkort til at returnere værdier, så du kan lave metoder, der kan genbruges, og holde logik i separate genanvendelige flows.

Debounce kan indstilles på triggere (Når kort): hvilket betyder, at du kan styre, hvor mange gange og på hvilken måde flows bliver udført inden for en bestemt periode.
- Udfør sidst ventende efter hver [antal] ms.
- Udfør ved start, tillad herefter udførelse efter hver [antal] ms.
- Udfør ved start, tillad herefter udførelse efter hver [antal] ms, afslut med sidste ventende.

(Bemærk venligst de ekstra forsinkelser under test i Avancerede Flows.)

Disse kort udføres næsten øjeblikkeligt, i modsætning til standard Start-A-Flow kort, der har en halv sekunds forsinkelse.