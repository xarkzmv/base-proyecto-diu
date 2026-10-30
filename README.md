# Casino USM Connect

Quiero que construyas un prototipo funcional (frontend, con datos mock/estado local, sin backend real por ahora) de una plataforma web de gestión de almuerzos para funcionarios y docentes de una universidad ("Casino USM"). El problema que resuelve: hoy el sistema solo publica la minuta semanal, pero no informa disponibilidad en tiempo real ni permite gestionar compromisos de asistencia, lo que genera que la gente llegue al comedor y su menú especial (hipocalórico o vegetariano) ya se haya agotado.

Construye el prototipo alrededor de estos dos módulos, que son el foco de esta iteración:

Módulo 1: Indicador de disponibilidad de menús (3 estados)

Para cada día de la semana, mostrar los menús disponibles (Común, Vegetariano, Hipocalórico) por comedor (Casa Central / Edificio P).

Cada menú debe tener un estado visual claro con 3 niveles:

🟢 Disponible — hay stock cómodo.

🟡 Por agotar — queda poco stock (define un umbral, ej. bajo un 20% de lo producido).

🔴 Agotado — no queda.

El estado debe ser visible desde el punto de decisión (por ejemplo, en una vista de "minuta de hoy/semana" que el usuario revisa antes de salir de su oficina), no solo al llegar al comedor.

Simula con datos mock un contador de raciones producidas vs. raciones ya canjeadas, y que el estado cambie dinámicamente (puedes usar un slider o botón de "simular canjes" para demostrarlo en la demo).

Si el usuario tiene un menú reservado que pasa a "por agotar" o "agotado", debe recibir una notificación/alerta visible dentro de la app (no hace falta email real, un banner o toast basta).

Módulo 2: Inscripción y compromiso, en dos flujos distintos

Diseña la inscripción como dos caminos separados y claramente distintos en la interfaz, no una sola pantalla genérica:

Caso A — Usuario suscrito (mensual o semanal)

El usuario elige una modalidad: suscripción mensual o semanal.

Debe poder indicar explícitamente qué días de la semana va a comer (ej. checkboxes L-M-M-J-V), no asumir que come todos los días.

Debe poder elegir, para los días marcados, qué tipo de menú prefiere por defecto (común/vegetariano/hipocalórico).

Debe quedar visible en su perfil/dashboard: su modalidad activa, los días configurados, y hasta cuándo rige (fecha de corte para modificarla).

Debe poder editar o cancelar días puntuales de su suscripción sin cancelar toda la suscripción (esto ataca la liberación de cupo, H5 — ceder el almuerzo de un día sin perder el beneficio).

Caso B — Usuario no suscrito

El usuario NO tiene una suscripción activa, así que cada almuerzo es una decisión puntual.

Debe pasar por un flujo explícito de compromiso y confirmación: elige el día y el menú, y el sistema le pide confirmar explícitamente que asistirá y consumirá ese menú (un paso de "Confirmar mi reserva" separado de solo "elegir").

Esta confirmación es lo que distingue una reserva real de una simple intención — debe sentirse como un compromiso, no como agregar algo a un carrito. Considera mostrar algo como "Al confirmar, cocina preparará tu plato. Si no vas a asistir, libera tu cupo antes de las X:00 hrs."

Debe quedar un estado visible de "Reservado y confirmado" vs "Pendiente de confirmar", y una opción clara para liberar esa reserva puntual antes de un plazo de corte.

Requisitos transversales

Ambos flujos (A y B) deben convivir en el mismo dashboard de usuario, pero visualmente diferenciados — el usuario no debería confundir "estoy suscrito este mes" con "reservé para mañana".

El plazo/corte para modificar o liberar una reserva debe mostrarse siempre de forma visible (hora exacta), no asumido como conocimiento tácito del usuario.

Diseño limpio, institucional pero cercano (piensa en un funcionario de oficina, usuario intermedio de sistemas, que revisa esto desde su computador, no un power user de apps de delivery).

Usa datos mock realistas: 3 tipos de menú, 2 comedores, nombres de días, cupos numéricos.

Empieza generando:

El dashboard principal con la vista de disponibilidad (Módulo 1).

El flujo de suscripción Caso A.

El flujo de reserva puntual Caso B.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://university-lunch-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4bec02d7-4efe-4265-bc26-867542c569c8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
