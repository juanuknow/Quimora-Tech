# Stitch + Claude Integration Setup

Guía completa para conectar Google Stitch (Talend Stitch) con Claude para transformación, enriquecimiento, validación e insights de datos.

---

## 🎯 Casos de Uso Cubiertos

1. **Transformación**: Normalización y limpieza automática de datos
2. **Enriquecimiento**: Resúmenes, clasificación, palabras clave, acciones sugeridas
3. **Validación**: Detección de problemas de calidad, inconsistencias, campos faltantes
4. **Insights**: Análisis de negocio, segmentación, oportunidades, estrategia

---

## 📋 Requisitos Previos

```bash
# Python 3.9+
pip install anthropic

# Para webhook (opcional)
pip install fastapi uvicorn
```

**Variables de entorno:**
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

---

## 🚀 Opción 1: Ejecución Local (Script Standalone)

Procesa datos de Stitch localmente en tu máquina o servidor:

### Paso 1: Preparar datos de Stitch

Exporta tus datos de Stitch como JSON:
```json
[
  {
    "id": 1,
    "customer_name": "Cliente A",
    "email": "a@example.com",
    "description": "Cliente potencial en retail",
    "created_at": "2024-07-01"
  }
]
```

### Paso 2: Ejecutar el script

```bash
python stitch-claude-integration.py
```

**Salida:**
- `stitch_claude_results.json` con todos los análisis
- Logs en consola mostrando cada paso

### Paso 3: Cargar resultados de vuelta a Stitch

Los resultados enriquecidos pueden importarse como nueva tabla en Stitch.

---

## 🌐 Opción 2: Webhook (Tiempo Real)

Conecta Stitch directamente con Claude vía HTTP webhook.

### Paso 1: Desplegar la API

**Opción A: Localmente**
```bash
uvicorn stitch-claude-integration.py:app --reload
# Accesible en: http://localhost:8000
```

**Opción B: En la nube (recomendado)**

**Google Cloud Run:**
```bash
# Crear Dockerfile
cat > Dockerfile << EOF
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "stitch-claude-integration.py:app", "--host", "0.0.0.0", "--port", "8080"]
EOF

# requirements.txt
cat > requirements.txt << EOF
anthropic
fastapi
uvicorn
EOF

# Deploy
gcloud run deploy stitch-claude --source . --allow-unauthenticated
```

**AWS Lambda (con API Gateway):**
```bash
# Usa el proyecto serverless:
pip install serverless-python-requirements
# (Configuración completa en serverless.yml)
```

**Vercel:**
```bash
# Crear vercel.json
{
  "functions": {
    "api/stitch.py": {
      "runtime": "python3.9"
    }
  }
}

vercel deploy
```

### Paso 2: Configurar Stitch para usar el webhook

En **Stitch > Transformations > Custom SQL/JavaScript**:

```sql
-- En Stitch, después de cargar datos, ejecutar:
-- (Stitch soporta webhooks POST)

-- Alternativa: usar Stitch Destinations custom
-- Crear destino que llame:
POST https://tu-api.com/stitch-claude
Content-Type: application/json

{
  "records": [
    -- tus registros de Stitch
  ],
  "table": "nombre_tabla"
}
```

**O usa Make (Integromat) como intermediario:**
1. Crear escenario en Make
2. Trigger: "Stitch: Descargar nuevos datos"
3. Action: "HTTP POST" → `https://tu-api.com/stitch-claude`
4. Esperar respuesta
5. Guardar en base de datos/Stitch

### Paso 3: Procesar respuesta

El webhook retorna:
```json
{
  "status": "success",
  "records_processed": 3,
  "enriched_data": [...],
  "validation": {...},
  "insights": "..."
}
```

Importa los datos enriquecidos como nueva tabla en Stitch.

---

## 🔌 Opción 3: Transformaciones en Stitch (SQL/JS)

Si Stitch soporta transformaciones custom, usa JavaScript para llamar Claude:

```javascript
// En Stitch > Transformations > Custom JavaScript
const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

async function enrichRow(record) {
  const message = await client.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: `Clasifica este cliente: ${JSON.stringify(record)}`
      }
    ]
  });
  return message.content[0].text;
}

// Aplicar a cada fila
export async function transform(records) {
  for (let record of records) {
    record.claude_classification = await enrichRow(record);
  }
  return records;
}
```

---

## 📊 Ejemplos de Resultados

### Enriquecimiento
```json
{
  "customer_name": "Juan García",
  "claude_enrichment": {
    "resumen": "Cliente retail con urgencia media-alta, busca solución e-commerce",
    "categoria": "Retail",
    "tamaño_empresa": "PYME",
    "urgencia_conversion": "Alta",
    "palabras_clave": ["e-commerce", "retail", "digitalización"],
    "siguiente_accion": "Enviar propuesta de web de ventas; agendar demo"
  }
}
```

### Validación
```json
{
  "records_validos": 28,
  "records_invalidos": 2,
  "problemas_encontrados": [
    "2 emails sin formato válido",
    "1 cliente sin descripción"
  ],
  "calidad_general": "93%",
  "recomendaciones": [
    "Validar formato de email antes de ingreso",
    "Hacer campo 'description' obligatorio"
  ]
}
```

### Insights
```
SEGMENTACIÓN IDENTIFICADA:
1. "Startups Tech" (4 clientes) - Alta urgencia, presupuesto limitado
2. "PYME Retail" (8 clientes) - Media urgencia, presupuesto medio
3. "Corporativos" (6 clientes) - Urgencia variable, presupuesto alto

OPORTUNIDADES:
- Startups: Bundle económico con pagos mensuales
- PYME: Demos de ROI rápido, testimonios de pares
- Corporativos: Sesión de estrategia, propuesta personalizada

RIESGOS:
- 3 clientes sin interacción en 7+ días: contacto urgente
```

---

## 🔒 Seguridad

**En producción:**

1. **API Key**: Usa variables de entorno, nunca hardcodees
   ```python
   api_key = os.getenv("ANTHROPIC_API_KEY")
   ```

2. **Autenticación en webhook**: Protege tu endpoint
   ```python
   from fastapi import Header, HTTPException

   @app.post("/stitch-claude")
   async def process(payload, authorization: str = Header(None)):
       if not authorization or authorization != f"Bearer {SECRET_KEY}":
           raise HTTPException(status_code=401)
   ```

3. **Rate limiting**: Stitch puede enviar muchos datos
   ```python
   from slowapi import Limiter
   
   limiter = Limiter(key_func=get_remote_address)
   
   @app.post("/stitch-claude")
   @limiter.limit("100/minute")
   async def process(payload):
       ...
   ```

4. **Validación de entrada**: Sanitiza datos de Stitch
   ```python
   from pydantic import BaseModel, validator
   
   class StitchPayload(BaseModel):
       records: list[dict]
       
       @validator('records')
       def validate_records(cls, v):
           if len(v) > 10000:  # Límite
               raise ValueError("Demasiados registros")
           return v
   ```

---

## 💰 Costos

**Claude API (Haiku):**
- Input: $0.80 / 1M tokens
- Output: $4 / 1M tokens

**Estimación por 1000 registros:**
- Enriquecimiento: ~$0.01-0.05
- Validación: ~$0.02-0.08
- Insights: ~$0.05-0.15
- **Total: ~$0.08-0.28 por 1000 registros**

---

## 🧪 Testing

```bash
# Probar localmente con datos de muestra
python stitch-claude-integration.py

# Probar webhook
curl -X POST http://localhost:8000/stitch-claude \
  -H "Content-Type: application/json" \
  -d '{
    "records": [
      {"id": 1, "name": "Test", "description": "Test customer"}
    ],
    "table": "customers"
  }'
```

---

## 📞 Soporte y Próximos Pasos

1. **Automatización completa**: Scheduler que ejecute cada X horas
2. **Dashboard**: Visualizar insights de todos los pipelines
3. **Alertas**: Notificar cuando hay oportunidades de alta prioridad
4. **A/B Testing**: Probar estrategias diferentes de follow-up

¿Necesitas ayuda con la configuración?
