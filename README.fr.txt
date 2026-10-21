Cartes de déclenchement et d'action avec nom d'événement pour les flux avancés

Application très légère pour ajouter plusieurs déclencheurs avec des tags sur un seul flux, en ajoutant un nom d'événement. Les flux peuvent être déclenchés en utilisant des arguments facultatifs. Il suffit d'ajouter une carte déclencheur (Quand), de définir le nom et de le sélectionner dans la carte action (Alors). Ou ajoutez une carte action (Alors), définissez le nom, et sélectionnez-la dans la carte déclencheur (Quand).

Vous pouvez utiliser la surcharge, ce qui signifie : une carte Quand avec 5 arguments peut être sélectionnée et déclenchée avec une carte Alors avec 1 seul argument.

Vous pouvez également mettre en file d'attente des flux, afin qu'ils s'exécutent les uns après les autres.

Il y a aussi des cartes de flux pour renvoyer des valeurs, vous pouvez donc créer des méthodes réutilisables, en gardant la logique dans des flux séparés réutilisables.

Le rebond peut être défini sur les déclencheurs (cartes Quand) : cela signifie que vous pouvez gérer combien de fois et de quelle manière les flux sont exécutés dans une certaine période.
- Exécutez le dernier en attente après chaque [nombre de] ms.
- Exécutez au début, puis permettez l'exécution après chaque [nombre de] ms.
- Exécutez au début, puis permettez l'exécution après chaque [nombre de] ms, terminez avec le dernier en attente.

(Veuillez noter les délais supplémentaires lors des tests dans les flux avancés.)

Ces cartes s'exécutent presque instantanément, contrairement aux cartes Par-Défaut-Démarrer-Un-Flux qui ont un délai d'une demi-seconde.