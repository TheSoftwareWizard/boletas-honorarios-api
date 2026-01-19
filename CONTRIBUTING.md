# Contribuir

Contribuciones son bienvenidas. Este documento describe cómo contribuir al proyecto.

## Cómo Contribuir

### Reportar Errores

Si encuentras un error, crea un issue en GitHub describiendo:
- Qué endpoint o funcionalidad tiene el problema
- Pasos para reproducir el error
- Comportamiento esperado vs comportamiento actual

### Actualizar Datos

Las tasas de retención se actualizan manualmente editando `data/retention-rates.json`.

**Importante**: Solo actualiza con datos oficiales del SII (Servicio de Impuestos Internos). Incluye la fuente y fecha de efectividad.

### Mejoras de Código

1. Fork el repositorio
2. Crea una rama para tu cambio (`git checkout -b feature/mi-mejora`)
3. Haz tus cambios
4. Asegúrate de que el código compile (`npm run build`)
5. Commit tus cambios (`git commit -m 'Descripción del cambio'`)
6. Push a tu fork (`git push origin feature/mi-mejora`)
7. Abre un Pull Request

### Estándares de Código

- Usa TypeScript
- Mantén el código simple y legible
- No agregues dependencias innecesarias
- Comentarios solo cuando expliquen "por qué", no "qué"
- Sigue el estilo existente del proyecto

### Testing

Antes de hacer un PR, verifica:
- `npm run build` compila sin errores
- `npm run type-check` pasa correctamente
- Los endpoints funcionan localmente

## Preguntas

Si tienes dudas, abre un issue en GitHub.
