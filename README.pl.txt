Karty wyzwalające i działające z nazwą zdarzenia dla Zaawansowanych Przepływów.

Bardzo lekka aplikacja do dodawania wielu wyzwalaczy z tagami w jednym przepływie, poprzez dodanie nazwy zdarzenia. Przepływy mogą być uruchamiane z opcjonalnymi argumentami. Wystarczy dodać kartę wyzwalającą (Kiedy), ustawić nazwę i wybrać ją w karcie działań (Wtedy). Albo dodać kartę działań (Wtedy), ustawić nazwę i wybrać ją w karcie wyzwalającej (Kiedy).

Można używać przeciążania, co oznacza: karta Kiedy z 5 argumentami może być wybrana i uruchomiona z kartą Wtedy z 1 argumentem.

Można również kolejkować przepływy, aby były wykonywane jeden po drugim.

Istnieją również karty przepływów do zwracania wartości, dzięki czemu można tworzyć metody, które mogą być ponownie wykorzystywane, utrzymując logikę w oddzielnych, wielorazowych przepływach.

Odliczanie można ustawić na wyzwalaczach (karty Kiedy): oznacza to, że można zarządzać, ile razy i w jaki sposób przepływy są wykonywane w określonym okresie.
- Wykonaj ostatnią czekającą po każdej [liczbie] ms.
- Wykonaj na początku, następnie zezwól na wykonywanie po każdej [liczbie] ms.
- Wykonaj na początku, następnie zezwól na wykonywanie po każdej [liczbie] ms, zakończ ostatnią czekającą.

(Proszę zauważyć dodatkowe opóźnienia podczas testowania w Zaawansowanych Przepływach.)

Te karty wykonują się prawie natychmiast, w przeciwieństwie do domyślnych kart Rozpocznij-Przepływ z opóźnieniem pół sekundy.