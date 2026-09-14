Tarjetas de activación y acción con nombre de evento para Flujos Avanzados

Aplicación muy ligera para agregar múltiples activadores con etiquetas en un solo flujo, agregando un nombre de evento. Los flujos pueden ser activados utilizando argumentos opcionales. Solo agrega una tarjeta de activación (Cuando), establece el nombre y selecciónala en la tarjeta de acción (Entonces). O agrega una tarjeta de acción (Entonces), establece el nombre y selecciónala en la tarjeta de activación (Cuando).

Puedes usar sobrecarga, lo que significa: Una tarjeta de Activación-Cuando con 5 argumentos puede ser seleccionada y activada con una tarjeta de Acción-Entonces con 1 argumento.

También puedes poner en cola los flujos, para que se ejecuten uno detrás de otro.

También hay tarjetas de flujo para devolver valores, de modo que puedes crear métodos que se pueden reutilizar, manteniendo la lógica en flujos reutilizables separados.

Se puede establecer rebote en activadores (tarjetas de Cuando): lo que significa que puedes gestionar cuántas veces y de qué manera los flujos se ejecutan dentro de un cierto período.
- Ejecutar el último en espera después de cada [número de] ms.
- Ejecutar al inicio, luego permitir la ejecución después de cada [número de] ms.
- Ejecutar al inicio, luego permitir la ejecución después de cada [número de] ms, terminando con el último en espera.

(Nota los retrasos adicionales durante las pruebas en Flujos Avanzados.)

Estas tarjetas se ejecutan casi al instante, a diferencia de las tarjetas predeterminadas de Inicio-De-Flujo que tienen medio segundo de retraso.