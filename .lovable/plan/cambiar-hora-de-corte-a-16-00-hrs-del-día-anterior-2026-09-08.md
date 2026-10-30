# Cambiar hora de corte a 16:00 hrs del día anterior

Actualizar todo el prototipo para que el corte diario sea a las **16:00 hrs del día anterior** en lugar de las 10:30 hrs del mismo día.

## Cambios

1. **Constante central**
   - En `src/lib/casino-data.ts` cambiar `HORA_CORTE` de `"10:30"` a `"16:00"`.

2. **Textos que indican el plazo**
   - `src/routes/index.tsx`: cambiar "...hasta las {HORA_CORTE} hrs de cada día" por "...hasta las {HORA_CORTE} hrs del día anterior".
   - `src/components/casino/AppShell.tsx`: cambiar "Corte diario {HORA_CORTE} hrs" por "Corte diario {HORA_CORTE} hrs del día anterior".
   - `src/routes/mis-compromisos.tsx` (línea ~80): el texto ya dice "del día anterior"; solo heredará el nuevo valor de la constante.
   - `src/routes/mis-compromisos.tsx` (línea ~184): cambiar "...hasta las {HORA_CORTE} hrs del {nombreDia(r.dia).toLowerCase()}" por "...hasta las {HORA_CORTE} hrs del día anterior".
   - `src/routes/reservar.tsx` (línea ~211): cambiar "...antes de las {HORA_CORTE} hrs del {nombreDia(dia).toLowerCase()}" por "...antes de las {HORA_CORTE} hrs del día anterior".
   - `src/routes/suscripcion.tsx` (línea ~234): cambiar "...hasta las {HORA_CORTE} hrs del día correspondiente" por "...hasta las {HORA_CORTE} hrs del día anterior".

3. **Verificación**
   - Buscar que no quede ninguna referencia literal a "10:30" en el código fuente.
   - Ejecutar `bunx tsc --noEmit` para confirmar que no hay errores de tipo.

## Alcance

Este cambio afecta solo textos y la constante compartida. El prototipo sigue sin lógica de backend ni validación real de horarios; se actualiza la información mostrada para que sea coherente con la nueva regla de negocio.
