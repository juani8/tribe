# Fase 4: Controles IAST – Guía de Instrumentación

## ¿Qué es IAST?

IAST (Interactive Application Security Testing) combina las ventajas de SAST y DAST:
instrumenta la aplicación **desde adentro** mientras se ejecuta, observando el flujo de datos
en tiempo real durante las pruebas. Esto permite detectar vulnerabilidades con muy pocos
falsos positivos porque tiene visibilidad del código fuente, las dependencias y el
comportamiento en runtime simultáneamente.

---

## Opciones de Agentes IAST para Node.js

| Herramienta | Tipo | Coste | Integración |
|---|---|---|---|
| **Contrast Security** (Community) | Agente IAST completo | Gratuito (Community) | npm package |
| **Hdiv / OpenRASP** | RASP + IAST | Open Source | Middleware Express |
| **Datadog APM + ASM** | APM con capacidades IAST | Pago (trial gratis) | dd-trace |
| **Snyk Code** (runtime) | SAST + capacidades IAST | Free tier | CLI + IDE |

### Recomendación: **Contrast Security Community Edition**

Es la opción más completa y gratuita para proyectos no-enterprise.

---

## Implementación con Contrast Security

### Paso 1: Instalar el agente

```bash
cd TribeBackend
npm install @contrast/agent
```

### Paso 2: Configurar el agente

Crear el archivo `contrast_security.yaml` en la raíz de `TribeBackend/`:

```yaml
api:
  url: https://ce.contrastsecurity.com/Contrast
  api_key: <TU_API_KEY>
  service_key: <TU_SERVICE_KEY>
  user_name: <TU_EMAIL>

agent:
  service:
    name: tribe-backend
  logger:
    level: INFO
    path: ./contrast-logs

application:
  name: Tribe Backend
  language: javascript
```

### Paso 3: Instrumentar el arranque

Modificar `TribeBackend/server/index.js` para cargar el agente **antes de todo lo demás**:

```javascript
// ── IAST Agent (solo en entornos de test/staging) ──
if (process.env.CONTRAST_ENABLED === 'true') {
  require('@contrast/agent');
  console.log('🔍 Contrast IAST agent loaded');
}

require("dotenv").config();
const connection = require("./db");
const app = require("./app");

// ... resto del código
```

### Paso 4: Activar en el Dockerfile / docker-compose

```dockerfile
# Dockerfile.iast (para testing)
FROM node:20-alpine

WORKDIR /app
COPY TribeBackend/ .
RUN npm ci

# Copiar config de Contrast
COPY contrast_security.yaml .

# Variables de entorno para IAST
ENV CONTRAST_ENABLED=true
ENV NODE_OPTIONS="--require @contrast/agent"

EXPOSE 8080
CMD ["node", "server/index.js"]
```

```yaml
# docker-compose.iast.yml
version: "3.9"
services:
  backend-iast:
    build:
      context: .
      dockerfile: Dockerfile.iast
    ports:
      - "8080:8080"
    environment:
      - CONTRAST_ENABLED=true
      - MONGODB_URI=mongodb://mongo:27017/tribe_test
      - JWT_SECRET=iast-test-secret
      - NODE_ENV=Development
    depends_on:
      - mongo

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
```

### Paso 5: Integrar en el pipeline de CI/CD

Agregar un job opcional al workflow de seguridad:

```yaml
  iast:
    name: "🔬 IAST (Contrast)"
    runs-on: ubuntu-latest
    needs: [sast]
    if: github.event_name == 'pull_request'  # solo en PRs
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4

      - name: Build IAST image
        run: docker compose -f docker-compose.iast.yml build

      - name: Start instrumented app
        run: |
          docker compose -f docker-compose.iast.yml up -d
          sleep 15  # esperar arranque

      - name: Run functional tests against instrumented app
        run: |
          # Ejecutar tus tests de integración/e2e contra localhost:8080
          cd TribeBackend
          npm test || true
          
          # O ejecutar ZAP contra la app instrumentada
          # para que Contrast observe los ataques desde adentro

      - name: Check Contrast results
        run: |
          # Consultar la API de Contrast para obtener vulnerabilidades
          curl -s -H "Authorization: ${{ secrets.CONTRAST_AUTH }}" \
            -H "API-Key: ${{ secrets.CONTRAST_API_KEY }}" \
            "https://ce.contrastsecurity.com/Contrast/api/ng/ORGID/traces/APPID/filter" \
            | python3 -c "
          import json, sys
          data = json.load(sys.stdin)
          vulns = data.get('traces', [])
          critical = [v for v in vulns if v.get('severity') in ('CRITICAL', 'HIGH')]
          print(f'Found {len(vulns)} total, {len(critical)} critical/high')
          if critical:
              for v in critical:
                  print(f'  ❌ {v[\"severity\"]}: {v[\"title\"]}')
              sys.exit(1)
          print('✅ No critical/high IAST findings')
          "

      - name: Tear down
        if: always()
        run: docker compose -f docker-compose.iast.yml down -v
```

---

## Alternativa Ligera: OpenRASP / Custom Middleware

Si no querés registrarte en Contrast, podés implementar un middleware IAST casero
que intercepte y loguee patrones sospechosos:

```javascript
// middlewares/iast.js – Solo para entornos de testing
const DANGEROUS_PATTERNS = [
  /(\$where|\$regex|\$gt|\$lt|\$ne|\$nin)/i,  // NoSQL injection
  /<script[\s>]/i,                               // XSS
  /(\.\.\/)|(\.\.\\)/,                           // Path traversal
  /(union\s+select|drop\s+table)/i,             // SQL injection
];

function iastMiddleware(req, res, next) {
  const inputs = [
    ...Object.values(req.query || {}),
    ...Object.values(req.body || {}),
    ...Object.values(req.params || {}),
  ].map(String);

  for (const input of inputs) {
    for (const pattern of DANGEROUS_PATTERNS) {
      if (pattern.test(input)) {
        console.warn(`🔴 IAST ALERT: Suspicious input detected!`);
        console.warn(`  Pattern: ${pattern}`);
        console.warn(`  Input: ${input}`);
        console.warn(`  Route: ${req.method} ${req.originalUrl}`);
        console.warn(`  Stack: ${new Error().stack}`);
        // En modo estricto: return res.status(400).json({ error: 'Blocked by IAST' });
      }
    }
  }
  next();
}

module.exports = iastMiddleware;
```

Activar solo con variable de entorno:

```javascript
// En app.js
if (process.env.IAST_ENABLED === 'true') {
  const iastMiddleware = require('../middlewares/iast');
  app.use(iastMiddleware);
  console.log('🔬 IAST middleware enabled');
}
```

---

## Diagrama del Pipeline Completo

```
                    ┌─────────────┐
                    │   PR / Push │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ Gitleaks │ │  Trivy   │ │  Trivy   │
        │ Secrets  │ │ Backend  │ │ Frontend │
        └────┬─────┘ └────┬─────┘ └────┬─────┘
             │             │            │
             ▼             │            │
        ┌──────────┐       │            │
        │ Semgrep  │◄──────┘            │
        │  SAST    │                    │
        └────┬─────┘                    │
             │                          │
             ▼                          │
        ┌──────────┐                    │
        │ ZAP DAST │◄──────────────────┘
        └────┬─────┘
             │
             ▼
        ┌──────────┐
        │ IAST     │ (opcional, en PR)
        │ Contrast │
        └────┬─────┘
             │
             ▼
        ┌──────────────┐
        │ Security Gate│
        │  (resumen)   │
        └──────────────┘
```

---

## Variables de Entorno / Secrets Requeridos

Para IAST con Contrast, configurar en GitHub Secrets:

| Secret | Descripción |
|---|---|
| `CONTRAST_API_KEY` | API Key de tu organización en Contrast |
| `CONTRAST_AUTH` | Header de autorización (Base64 de user:service_key) |

---

## Próximos Pasos

1. Registrarse en [Contrast Community Edition](https://www.contrastsecurity.com/community-edition)
2. Crear la aplicación "Tribe Backend" en el dashboard
3. Obtener las credenciales (API Key, Service Key)
4. Configurar los GitHub Secrets
5. Probar el pipeline con un PR que contenga código vulnerable intencional
