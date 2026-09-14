Carte trigger e azione con nome evento per Flussi Avanzati

App molto leggera per aggiungere più trigger con tag in un singolo flusso, aggiungendo un nome evento. I flussi possono essere attivati usando argomenti opzionali. Basta aggiungere una trigger card (Quando), impostare il nome e selezionarla nella scheda azione (Allora). Oppure aggiungere e impostare una scheda azione (Allora), impostare il nome e selezionarla nella scheda trigger (Quando).

Puoi usare il sovraccarico, significa che: una carta Quando con 5 argomenti può essere selezionata e attivata con una carta Allora con 1 argomento.

Puoi anche mettere in coda i flussi, in modo che vengano eseguiti uno dopo l'altro.

Ci sono anche carte flusso per restituire valori, così puoi creare metodi che possono essere riutilizzati, mantenendo la logica in flussi separati e riutilizzabili.

Il debounce può essere impostato sui trigger (carte Quando): significa che puoi gestire quante volte e in che modo i flussi vengono eseguiti entro un certo periodo.
- Esegui l'ultimo in attesa dopo ogni [numero di] ms.
- Esegui all'inizio, poi consenti l'esecuzione dopo ogni [numero di] ms.
- Esegui all'inizio, poi consenti l'esecuzione dopo ogni [numero di] ms, termina con l'ultimo in attesa.

(Nota i ritardi aggiuntivi durante i test nei Flussi Avanzati.)

Queste carte vengono eseguite quasi istantaneamente, al contrario delle carte Avvia-Un-Flusso predefinite con un ritardo di mezzo secondo.