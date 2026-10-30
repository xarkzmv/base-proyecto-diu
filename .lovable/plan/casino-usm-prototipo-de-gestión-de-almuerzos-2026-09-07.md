# Casino USM — Prototipo de gestión de almuerzos

Prototipo solo de frontend, con datos simulados en memoria (sin backend). Todo lo que se muestre es realista pero ficticio: nombres de menús, cupos, horarios de corte.

## Pantallas

### 1. Panel principal (inicio)
- Encabezado institucional con el nombre del usuario de ejemplo (funcionario), su estado ("Suscrito mensual" o "Sin suscripción") y la hora de corte del día en grande: "Puedes modificar o liberar hasta las 10:30 hrs".
- Tira de días de la semana (Lun a Vie) seleccionable; por defecto el día de hoy.
- Para el día elegido, dos bloques de comedor: Casa Central y Edificio P. Dentro de cada uno, tres tarjetas de menú (Común, Vegetariano, Hipocalórico) con:
  - nombre del plato del día,
  - contador "X de Y raciones disponibles" con barra,
  - semáforo: verde Disponible (>20% restante), amarillo Por agotar (1%–20%), rojo Agotado (0).
- Panel de demostración: control deslizante y botón "Simular canjes" que descuenta raciones en vivo para mostrar el cambio de color.
- Si un menú que el usuario tiene reservado baja a "Por agotar" o "Agotado", aparece un aviso destacado arriba y un mensaje emergente.

### 2. Mis compromisos (en el mismo panel, dos bloques separados visualmente)
- Bloque A "Mi suscripción": modalidad activa, días configurados, menú por defecto, vigencia y fecha límite para cambios. Acciones: editar días, liberar un día puntual (sin perder la suscripción), cancelar suscripción.
- Bloque B "Reservas puntuales": lista de reservas con estado "Reservado y confirmado" o "Pendiente de confirmar", con la hora de corte y botón "Liberar cupo".
- Los dos bloques usan color, borde e íconos distintos para que no se confundan.

### 3. Caso A — Alta/edición de suscripción (asistente de 3 pasos)
1. Elegir modalidad: semanal o mensual (con la vigencia que implica cada una).
2. Marcar los días que asistirá (L-M-M-J-V) y el comedor habitual.
3. Elegir el tipo de menú por defecto para cada día marcado; resumen y confirmación.
- Al terminar vuelve al panel con la suscripción activa visible.

### 4. Caso B — Reserva puntual (asistente de 2 pasos + confirmación)
1. Elegir día, comedor y menú (los agotados no se pueden elegir; los "por agotar" muestran advertencia).
2. Pantalla de compromiso: resumen del plato, texto "Al confirmar, cocina preparará tu plato. Si no asistirás, libera tu cupo antes de las 10:30 hrs", casilla de aceptación y botón "Confirmar mi reserva".
- Mientras no se confirme, la reserva queda "Pendiente de confirmar"; al confirmar pasa a "Reservado y confirmado" y descuenta una ración.

## Datos simulados
- 2 comedores, 3 tipos de menú, 5 días con platos distintos, producción entre 60 y 220 raciones por menú y canjes iniciales variados para que ya se vean los tres estados.
- Un usuario de ejemplo con suscripción mensual (L, M, J) y una reserva puntual pendiente.

## Notas técnicas
- Rutas: `/` (panel), `/suscripcion`, `/reservar`, `/mis-compromisos`.
- Estado compartido en un contexto de React en memoria (se reinicia al recargar); avisos con toasts.
- Diseño institucional: azul USM profundo + gris cálido, tipografía clara, densidad media, sin estética de app de delivery.
