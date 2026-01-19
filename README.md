# API de Boletas de Honorarios

API REST para datos de retención de boletas de honorarios profesionales chilenos. Proporciona tasas de retención actuales e históricas.

## Endpoints

### GET /v1/retention

Tasa de retención actual y metadatos.

```json
{
  "statusCode": 200,
  "rate": 15.25,
  "effectiveDate": "2026-01-01T00:00:00Z",
  "source": "SII (Servicio de Impuestos Internos) - Ley 21.133",
  "lastUpdated": "2026-01-01T00:00:00Z",
  "metadata": {
    "currency": "CLP",
    "description": "Chilean Peso withholding rate for professional service invoices (boletas de honorarios)"
  }
}
```

### GET /v1/retention/history

Tasas históricas por año.

```json
{
  "statusCode": 200,
  "rates": [
    {
      "year": 2026,
      "rate": 15.25,
      "effectiveDate": "2026-01-01T00:00:00Z",
      "source": "SII (Servicio de Impuestos Internos) - Ley 21.133",
      "lastUpdated": "2026-01-01T00:00:00Z"
    },
    {
      "year": 2025,
      "rate": 14.5,
      "effectiveDate": "2025-01-01T00:00:00Z",
      "source": "SII (Servicio de Impuestos Internos) - Ley 21.133",
      "lastUpdated": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 11
}
```

## Instalación

```bash
npm install
npm run build
npm start
```

El servidor corre en `http://localhost:3000` por defecto. La documentación del frontend está disponible en la ruta raíz.

## Actualizar Datos

### Tasas de Retención

Edita `data/retention-rates.json` directamente para actualizar las tasas de retención.

## Configuración

- `PORT` - Puerto del servidor (por defecto: 3000)
- `HOST` - Host del servidor (por defecto: 0.0.0.0)
- `LOG_LEVEL` - Nivel de logging (por defecto: info)
- `NODE_ENV` - Entorno (development/production)

## Límite de Velocidad

100 solicitudes por minuto por IP. Retorna 429 cuando se excede.

## Despliegue

### Vercel

Agrega `vercel.json`:

```json
{
  "version": 2,
  "builds": [{"src": "dist/index.js", "use": "@vercel/node"}],
  "routes": [{"src": "/(.*)", "dest": "dist/index.js"}]
}
```

Agrega a `package.json`:
```json
{
  "scripts": {
    "vercel-build": "npm run build"
  }
}
```

### Cloudflare Workers

Nota: Fastify puede necesitar adaptación. Considera usar un framework compatible con Workers o adaptar el código del servidor.

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/index.js"]
```
