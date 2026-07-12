#!/usr/bin/env python3
"""
Stitch + Claude Integration
Procesa datos de Stitch con Claude para:
1. Transformación de datos
2. Enriquecimiento (traducciones, resúmenes, clasificación)
3. Validación
4. Generación de insights
"""

import json
import os
from typing import Any
from anthropic import Anthropic

client = Anthropic()

# ================== CONFIGURACIÓN ==================
STITCH_DATA_SAMPLE = [
    {
        "id": 1,
        "customer_name": "Juan García",
        "email": "juan@example.com",
        "description": "Cliente potencial en el sector retail, interesado en soluciones de e-commerce",
        "language": "es",
        "created_at": "2024-07-01"
    },
    {
        "id": 2,
        "customer_name": "Maria Silva",
        "email": "maria@example.com",
        "description": "Empresa de manufactura buscando automatizar procesos",
        "language": "es",
        "created_at": "2024-07-05"
    },
    {
        "id": 3,
        "customer_name": "Carlos López",
        "email": "carlos@example.com",
        "description": "Startup tech con presupuesto limitado",
        "language": "es",
        "created_at": "2024-07-08"
    }
]

# ================== TRANSFORMACIÓN ==================
def transform_data(data: list[dict]) -> list[dict]:
    """
    Transforma datos usando Claude (normalización, limpieza, estructuración)
    """
    print("\n📊 TRANSFORMACIÓN DE DATOS")
    print("-" * 50)

    conversation = []

    # Paso 1: Análisis de estructura
    conversation.append({
        "role": "user",
        "content": f"""Analiza esta estructura de datos y propón una transformación óptima para normalizarla:

```json
{json.dumps(data[:1], indent=2, ensure_ascii=False)}
```

¿Qué campos se pueden estandarizar? ¿Qué validaciones son necesarias?"""
    })

    response = client.messages.create(
        model="claude-3-5-haiku-20241022",
        max_tokens=1000,
        messages=conversation
    )
    analysis = response.content[0].text
    print("Análisis de estructura:")
    print(analysis)
    conversation.append({"role": "assistant", "content": analysis})

    # Paso 2: Aplicar transformación
    conversation.append({
        "role": "user",
        "content": f"""Basándote en tu análisis, proporciona un esquema JSON limpio y normalizado
        para estos {len(data)} registros. Incluye:
        - Campos estandarizados
        - Tipos de dato
        - Ejemplos transformados

        Datos completos a transformar:
        ```json
        {json.dumps(data, indent=2, ensure_ascii=False)}
        ```"""
    })

    response = client.messages.create(
        model="claude-3-5-haiku-20241022",
        max_tokens=1500,
        messages=conversation
    )
    transformation = response.content[0].text
    print("\n✅ Esquema normalizado propuesto:")
    print(transformation)

    return data

# ================== ENRIQUECIMIENTO ==================
def enrich_data(data: list[dict]) -> list[dict]:
    """
    Enriquece datos: resúmenes, clasificación, traducción, palabras clave
    """
    print("\n\n🎯 ENRIQUECIMIENTO DE DATOS")
    print("-" * 50)

    conversation = []

    # Paso 1: Clasificación y resumen
    for record in data[:2]:  # Procesar primeros 2 para demo
        conversation = []

        prompt = f"""Analiza este registro de cliente y proporciona en JSON:
{{
    "resumen": "1-2 líneas clave sobre el cliente",
    "categoria": "Categoría de negocio (retail/tech/manufactura/otro)",
    "tamaño_empresa": "Estimado (startup/pyme/empresa/corporativo)",
    "urgencia_conversion": "Baja/Media/Alta (basado en la descripción)",
    "palabras_clave": ["palabra1", "palabra2", "palabra3"],
    "siguiente_accion": "Acción sugerida para el equipo de ventas"
}}

Cliente:
Nombre: {record['customer_name']}
Email: {record['email']}
Descripción: {record['description']}
"""

        response = client.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=500,
            messages=[{"role": "user", "content": prompt}]
        )

        enrichment = response.content[0].text
        print(f"\n📌 Cliente: {record['customer_name']}")
        print(enrichment)

        # Guardar enriquecimiento en el registro
        try:
            record['claude_enrichment'] = json.loads(enrichment)
        except json.JSONDecodeError:
            # Si no es JSON válido, guardarlo como texto
            record['claude_enrichment'] = {"raw_analysis": enrichment}

    return data

# ================== VALIDACIÓN ==================
def validate_data(data: list[dict]) -> dict[str, Any]:
    """
    Valida datos usando Claude (calidad, completitud, coherencia)
    """
    print("\n\n✔️ VALIDACIÓN DE DATOS")
    print("-" * 50)

    conversation = []

    # Paso 1: Análisis de calidad
    conversation.append({
        "role": "user",
        "content": f"""Valida estos registros de clientes. Devuelve un JSON con:
{{
    "records_validos": número,
    "records_invalidos": número,
    "problemas_encontrados": ["problema1", "problema2"],
    "datos_inconsistentes": ["ejemplo de inconsistencia"],
    "campos_faltantes": ["campo1"],
    "calidad_general": "Porcentaje (%)",
    "recomendaciones": ["recomendación1"]
}}

Datos a validar:
```json
{json.dumps(data, indent=2, ensure_ascii=False)}
```"""
    })

    response = client.messages.create(
        model="claude-3-5-haiku-20241022",
        max_tokens=800,
        messages=conversation
    )
    validation = response.content[0].text
    print("Reporte de validación:")
    print(validation)
    conversation.append({"role": "assistant", "content": validation})

    # Paso 2: Sugerencias de corrección
    conversation.append({
        "role": "user",
        "content": "¿Cuáles son los 3 cambios prioritarios para mejorar la calidad de estos datos?"
    })

    response = client.messages.create(
        model="claude-3-5-haiku-20241022",
        max_tokens=500,
        messages=conversation
    )
    recommendations = response.content[0].text
    print("\n📋 Cambios prioritarios:")
    print(recommendations)

    return {
        "validation_report": validation,
        "recommendations": recommendations
    }

# ================== INSIGHTS ==================
def generate_insights(data: list[dict]) -> str:
    """
    Genera insights de negocio a partir de los datos
    """
    print("\n\n💡 GENERACIÓN DE INSIGHTS")
    print("-" * 50)

    conversation = []

    # Paso 1: Análisis general
    conversation.append({
        "role": "user",
        "content": f"""Analiza este pipeline de clientes y genera insights para el equipo de ventas.

Datos del pipeline:
```json
{json.dumps(data, indent=2, ensure_ascii=False)}
```

Proporciona:
1. Segmentación de clientes (grupos identificados)
2. Oportunidades de venta (dónde hay mayor potencial)
3. Riesgos (clientes que podrían no convertir)
4. Recomendaciones estratégicas"""
    })

    response = client.messages.create(
        model="claude-3-5-haiku-20241022",
        max_tokens=1200,
        messages=conversation
    )
    insights = response.content[0].text
    print("Análisis general:")
    print(insights)
    conversation.append({"role": "assistant", "content": insights})

    # Paso 2: Estrategia personalizada
    conversation.append({
        "role": "user",
        "content": """Basándote en este análisis, ¿cuál debería ser la estrategia de follow-up
        diferenciada para cada segmento? Sé específico y accionable."""
    })

    response = client.messages.create(
        model="claude-3-5-haiku-20241022",
        max_tokens=800,
        messages=conversation
    )
    strategy = response.content[0].text
    print("\n🎯 Estrategia de follow-up:")
    print(strategy)

    return f"{insights}\n\n{strategy}"

# ================== INTEGRACIÓN WEBHOOK (OPCIONAL) ==================
def create_webhook_handler():
    """
    Crea un handler para que Stitch envíe datos vía HTTP POST
    Úsalo con: pip install fastapi uvicorn
    """

    webhook_code = '''
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
from anthropic import Anthropic

app = FastAPI()
client = Anthropic()

class StitchPayload(BaseModel):
    records: list[dict]
    table: str

@app.post("/stitch-claude")
async def process_stitch_data(payload: StitchPayload):
    """
    Endpoint que Stitch puede llamar con POST
    URL en Stitch: https://tu-dominio.com/stitch-claude
    """
    try:
        # Procesar con Claude
        enriched = await enrich_data(payload.records)
        validation = await validate_data(payload.records)
        insights = await generate_insights(payload.records)

        return {
            "status": "success",
            "records_processed": len(payload.records),
            "enriched_data": enriched,
            "validation": validation,
            "insights": insights
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Ejecutar con: uvicorn script.py --host 0.0.0.0 --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
'''

    return webhook_code

# ================== MAIN ==================
def main():
    """
    Ejecuta el pipeline completo de Stitch + Claude
    """
    print("=" * 60)
    print("STITCH + CLAUDE INTEGRATION - PIPELINE COMPLETO")
    print("=" * 60)

    # Definir API Key
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("Configura ANTHROPIC_API_KEY como variable de entorno")

    # 1. TRANSFORMACIÓN
    transformed_data = transform_data(STITCH_DATA_SAMPLE)

    # 2. ENRIQUECIMIENTO
    enriched_data = enrich_data(transformed_data)

    # 3. VALIDACIÓN
    validation_results = validate_data(enriched_data)

    # 4. INSIGHTS
    business_insights = generate_insights(enriched_data)

    # 5. GUARDAR RESULTADOS
    results = {
        "transformed_data": transformed_data,
        "validation": validation_results,
        "insights": business_insights,
        "timestamp": __import__("datetime").datetime.now().isoformat()
    }

    with open("stitch_claude_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print("\n" + "=" * 60)
    print("✅ PROCESAMIENTO COMPLETADO")
    print("Resultados guardados en: stitch_claude_results.json")
    print("=" * 60)

if __name__ == "__main__":
    main()
