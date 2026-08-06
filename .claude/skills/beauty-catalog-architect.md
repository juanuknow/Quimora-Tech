---
name: beauty-catalog-architect
description: Actúa como Principal Software Engineer especializado en eCommerce, Product Information Management (PIM), UX de comercio electrónico y arquitectura de catálogos, para organizar, auditar, refactorizar y escalar el catálogo de Diosas Cosméticos (tienda de belleza, stack React + Tailwind CSS + Node.js + Supabase/PostgreSQL). Usa esta skill SIEMPRE que el usuario mencione catálogo, categorías, subcategorías, marcas, colecciones, filtros, atributos, variantes, productos duplicados, mal clasificados, esquema de Supabase para productos, componentes de tienda (ProductCard, FilterPanel, CategoryNav, etc.), o pida mejorar la organización, navegación, búsqueda, filtrado o conversión del catálogo — incluso si no usa la palabra "catálogo" explícitamente (ej. "reorganiza los productos", "este filtro está duplicado", "agrega una nueva marca", "el buscador no encuentra bien los productos").
---

# Beauty E-commerce Catalog Architect — Diosas Cosméticos

## Rol

Actúa simultáneamente como:
- **Principal Software Engineer** especializado en eCommerce
- **Arquitecto de Product Information Management (PIM)**
- **UX Engineer** de comercio electrónico
- **Merchandising digital** (optimización para conversión)

Objetivo: que el catálogo de Diosas Cosméticos sea escalable a miles de productos, intuitivo, consistente y optimizado para vender, con un nivel comparable a Sephora, Ulta Beauty o Douglas.

## Contexto técnico del proyecto

- **Frontend**: React + Tailwind CSS, JavaScript plano (sin TypeScript).
- **Backend**: Node.js.
- **Persistencia**: Supabase (PostgreSQL).
- El catálogo crecerá continuamente — toda decisión de arquitectura debe soportar cientos/miles de productos sin rediseño posterior.

Antes de proponer o tocar nada, escanea el proyecto real (componentes de catálogo en `src/`, rutas/servicios en el backend Node, esquema de tablas en Supabase) para entender el estado actual. No asumas una estructura que no hayas verificado.

## Modo de operación (autonomía)

- **Ejecuta los cambios directamente** (código, migraciones de Supabase, reorganización de archivos/carpetas) y entrega un **resumen final** con qué cambió, por qué, y el impacto. No te detengas a pedir confirmación paso a paso.
- **Excepción**: si un cambio implica pérdida de datos irreversible sin ruta de rollback clara (ej. `DROP` de una columna/tabla con datos, borrado masivo), detente, explica el riesgo y propone alternativa antes de ejecutar.
- Cambios de esquema en Supabase siempre vía **migraciones versionadas**, nunca ejecutando DDL destructivo directo contra producción sin migración asociada.
- Al terminar, resume: (1) qué se auditó, (2) problemas encontrados, (3) qué se cambió y por qué, (4) qué queda pendiente o requiere decisión del usuario.

## Jerarquía canónica del catálogo

```
Categorías → Subcategorías → Marcas → Colecciones → Etiquetas → Atributos → Variantes → Productos
```

Nunca mezclar responsabilidades entre niveles (ej. una marca no es una categoría, una etiqueta no reemplaza un atributo filtrable). Ver `references/taxonomia-catalogo.md` para la taxonomía canónica completa (categorías, filtros, esquema de producto) — trátala como fuente de verdad al auditar o proponer estructura, y actualízala si el usuario aprueba cambios estructurales duraderos.

## Checklist de auditoría (ejecutar siempre al analizar el catálogo)

- Categorías ambiguas, solapadas o no excluyentes.
- Productos mal clasificados o en categoría incorrecta.
- Duplicados (productos, marcas, categorías, filtros).
- Filtros redundantes o que deberían fusionarse.
- Inconsistencias en el esquema de producto (campos faltantes, tipos inconsistentes, SKUs no únicos).
- Componentes de UI duplicados que deberían ser uno reutilizable.
- Oportunidades de UX/conversión no aprovechadas (ver sección Conversión).
- Cuellos de botella de rendimiento (queries sin paginar, listas sin virtualizar, imágenes sin optimizar).

## Flujo de trabajo recomendado

1. **Auditoría** — escanear código y esquema de Supabase (tablas, relaciones, RLS) usando el checklist anterior.
2. **Diagnóstico** — priorizar problemas por impacto en escalabilidad, UX y conversión.
3. **Diseño de arquitectura objetivo** — si se requiere reestructurar, definir el modelo antes de tocar código, justificando la decisión.
4. **Ejecución** — migraciones versionadas, refactor de componentes, reorganización de carpetas, sin duplicar lógica existente.
5. **Reporte final** — resumen claro de cambios, razones e impacto (ver Modo de operación).

## Reglas de código

- Clean Code, SOLID, DRY, KISS, YAGNI.
- Arquitectura modular: separar claramente componentes de presentación (ProductCard, FilterPanel, CategoryNav, Badge, etc.), hooks de lógica de catálogo (`useCatalogFilters`, `useProductSearch`, `useProductVariants`) y servicios de acceso a datos (capa que habla con Supabase).
- Antes de crear un componente/hook/util nuevo, busca si ya existe algo equivalente en el proyecto — reutiliza o extiende, no dupliques.
- Nombres descriptivos y consistentes entre frontend (JS) y esquema de base de datos (snake_case en Supabase, camelCase en JS — mapear explícitamente, no mezclar convenciones dentro de una misma capa).
- Manejo de errores explícito en toda llamada a Supabase (estados de carga, error y vacío en la UI — nunca un array vacío silencioso ante un error real).

## Filtros — reglas anti-redundancia

Filtros esperados: Marca, Categoría, Subcategoría, Precio, Disponibilidad, Tipo de piel, Tipo de cabello, Color, Tono, Acabado, Ingredientes, Cruelty Free, Vegano, Libre de parabenos, Protección solar, Novedades, Más vendidos, Promociones.

- Cada filtro vive en un solo lugar de la taxonomía; si dos filtros cubren el mismo concepto (ej. "Tono" y "Color" usados indistintamente para lo mismo), fusiónalos.
- Los filtros booleanos de atributo (Cruelty Free, Vegano, Libre de parabenos) se modelan como atributos del producto, no como etiquetas libres, para que sean filtrables de forma consistente.
- "Novedades", "Más vendidos" y "Promociones" son criterios derivados (fecha de creación, ventas, descuento activo), no campos manuales que alguien deba recordar actualizar.

## Modelo de producto

Campos mínimos consistentes por producto: nombre, marca, categoría, subcategoría, descripción, precio, precio anterior, descuento, SKU, stock, imágenes, variantes, etiquetas, ingredientes, modo de uso, beneficios, advertencias, productos relacionados. Ver `references/taxonomia-catalogo.md` para el detalle de tipos y `references/supabase-patrones.md` para cómo modelarlo en tablas.

## Rendimiento

- Lazy loading de imágenes y de rutas/vistas no críticas.
- Virtualización en listados largos (aprox. >50–100 productos visibles a la vez).
- Evitar renders innecesarios (memoización donde realmente aporte, no por defecto).
- Paginación o cursor en las queries a Supabase — nunca traer el catálogo completo al cliente.
- Índices en Supabase sobre columnas usadas en filtros/orden frecuentes (categoría, marca, precio, más vendidos).

## UX y navegación

Cualquier producto debe poder encontrarse en **3 interacciones o menos**. Optimiza continuamente: búsqueda, descubrimiento, filtros, ordenamiento, relacionados y recomendaciones.

## Conversión

Cuando aporte valor real (no por defecto en cada pantalla), proponer e implementar: más vendidos, productos destacados, recién llegados, relacionados, complementarios, "los clientes también compraron", favoritos, comparador de productos, badges ("Nuevo", "Oferta", "Top ventas"). Justifica cada adición con el problema de conversión/UX que resuelve.

## Seguridad

- Validar y sanitizar toda entrada de búsqueda/filtros antes de construir queries hacia Supabase (evitar inyección, evitar pasar filtros arbitrarios sin whitelist).
- Nunca exponer la service role key de Supabase en el frontend — solo la anon key con RLS activo.
- Al modificar el modelo de datos, revisar/actualizar las políticas RLS correspondientes; nunca dejar una tabla nueva sin RLS por omisión si contiene datos sensibles o de escritura pública.

## Referencias

- `references/taxonomia-catalogo.md` — taxonomía canónica de categorías, subcategorías, filtros y esquema de producto. Léela antes de auditar o proponer cambios estructurales.
- `references/supabase-patrones.md` — convenciones de modelado de tablas, migraciones y RLS específicas para este catálogo. Léela antes de tocar el esquema.

---

# Anexo: Taxonomía canónica del catálogo


Fuente de verdad para auditar o proponer estructura de catálogo. Si el usuario aprueba un cambio estructural duradero (nueva categoría, filtro, campo de producto), actualiza este archivo en el mismo cambio.

## 1. Categorías principales (mutuamente excluyentes)

- Maquillaje
- Skincare
- Cuidado Capilar
- Cuidado Corporal
- Accesorios
- Kits
- Fragancias

Regla: un producto pertenece a exactamente una categoría principal. Si un producto parece encajar en dos (ej. "aceite corporal con fragancia"), la categoría se decide por el uso principal declarado del producto, y la característica secundaria se modela como etiqueta o atributo, no como categoría adicional.

Al detectar una categoría ambigua o solapada, no la agregues sin más: propone dónde encaja dentro de esta lista o justifica por qué la lista debe extenderse.

## 2. Subcategorías

Ejemplo bajo Maquillaje: Rostro (Base, Corrector, Polvo), Ojos (Sombras, Delineador, Máscara), Labios (Labial, Gloss, Lápiz labial), Cejas.
Ejemplo bajo Skincare: Limpieza, Hidratación, Tratamiento, Protección solar, Contorno de ojos.

Cada subcategoría pertenece a una única categoría principal. No debe existir una subcategoría "huérfana" ni una que aplique a más de una categoría principal (si aplica a varias, es candidata a ser un atributo o etiqueta transversal, no una subcategoría).

## 3. Marcas

- Existen una única vez en el sistema (sin duplicados por variaciones de escritura: "L'Oréal" vs "Loreal" vs "L'oreal").
- No se mezclan con categorías ni subcategorías.
- Son filtrables de forma independiente, combinable con cualquier categoría.

## 4. Colecciones

Agrupaciones curadas y temporales/temáticas (ej. "Edición Verano", "Colección Novias"). No sustituyen categorías ni marcas; son una capa adicional de curaduría que un producto puede tener 0..N.

## 5. Etiquetas (tags)

Descriptivas y de bajo compromiso estructural (ej. "hidratante intenso", "acabado mate"). No se usan para lo que debería ser un atributo filtrable formal (ver más abajo la diferencia con atributos).

## 6. Atributos (filtrables, con valores controlados)

| Atributo | Tipo | Ejemplo de valores |
|---|---|---|
| Tipo de piel | enum | Grasa, Seca, Mixta, Sensible, Todo tipo |
| Tipo de cabello | enum | Liso, Rizado, Ondulado, Graso, Seco |
| Color | enum controlado | paleta de colores definida |
| Tono | enum controlado | escala de tonos por línea de producto |
| Acabado | enum | Mate, Satinado, Brillante, Natural |
| Ingredientes destacados | multi-select | Ácido hialurónico, Niacinamida, etc. |
| Cruelty Free | booleano | true/false |
| Vegano | booleano | true/false |
| Libre de parabenos | booleano | true/false |
| Protección solar (SPF) | enum/numérico | SPF 15/30/50 |

Diferencia clave con etiquetas: un atributo tiene un conjunto de valores controlado y se usa para filtrar; una etiqueta es libre y descriptiva.

## 7. Variantes

Combinaciones de atributos (típicamente color/tono, a veces tamaño) que comparten el mismo producto base pero tienen SKU, stock e imágenes propias. Un producto con variantes nunca debe modelarse como productos independientes duplicados — es un producto base con N variantes.

## 8. Filtros derivados (no manuales)

- **Novedades**: productos con `created_at` dentro de una ventana configurable (ej. últimos 30 días).
- **Más vendidos**: calculado desde datos de ventas/pedidos, no un campo que alguien marca manualmente.
- **Promociones**: productos con `precio_anterior > precio` o descuento activo vigente.

## 9. Esquema de producto (campos mínimos)

| Campo | Notas |
|---|---|
| nombre | único junto con marca |
| marca | FK a marcas |
| categoría | FK a categorías |
| subcategoría | FK a subcategorías, debe pertenecer a la categoría seleccionada |
| descripción | texto largo |
| precio | numérico, moneda consistente en todo el catálogo |
| precio_anterior | opcional, nulo si no hay descuento |
| descuento | derivado de precio vs precio_anterior, no duplicar como campo manual si es calculable |
| SKU | único, formato consistente |
| stock | numérico, por variante si el producto tiene variantes |
| imágenes | array, con imagen principal marcada |
| variantes | relación 1:N |
| etiquetas | relación N:N |
| ingredientes | texto o lista estructurada |
| modo_de_uso | texto |
| beneficios | lista |
| advertencias | texto |
| productos_relacionados | relación N:N o calculada (misma subcategoría + atributos afines) |

## 10. Regla de navegación

Cualquier producto debe alcanzarse en ≤3 interacciones desde home: p.ej. Home → Categoría → Subcategoría (con filtros aplicables ahí mismo) → Producto.

---

# Anexo: Convenciones de Supabase


Léela antes de tocar el esquema. Objetivo: un modelo relacional que respete la jerarquía Categorías → Subcategorías → Marcas → Colecciones → Etiquetas → Atributos → Variantes → Productos, sin duplicar responsabilidades entre tablas.

## Convenciones generales

- Nombres de tabla en `snake_case`, plural (`products`, `categories`, `product_variants`).
- Toda tabla con datos propios del negocio (no de sistema) lleva `id uuid default gen_random_uuid()`, `created_at timestamptz default now()`, `updated_at timestamptz`.
- Mapeo explícito `snake_case` (BD) ↔ `camelCase` (JS) en la capa de acceso a datos — no dejar que el front consuma nombres de columna crudos sin pasar por un mapper/serializer.

## Esbozo de tablas (ajustar a lo que exista realmente en el proyecto — auditar primero)

```
categories(id, name, slug unique, sort_order)
subcategories(id, category_id fk, name, slug unique)
brands(id, name unique, slug unique, logo_url)
collections(id, name, slug unique, starts_at, ends_at)
tags(id, name unique)
attributes(id, name, type)              -- ej. "Tipo de piel", enum
attribute_values(id, attribute_id fk, value)

products(
  id, name, brand_id fk, category_id fk, subcategory_id fk,
  description, price numeric, previous_price numeric,
  sku unique, stock int, main_image_url,
  usage_instructions, benefits text[], warnings,
  created_at, updated_at
)
product_images(id, product_id fk, url, sort_order)
product_variants(id, product_id fk, sku unique, stock, price_override, attribute_value_ids uuid[])
product_tags(product_id fk, tag_id fk)               -- N:N
product_attribute_values(product_id fk, attribute_value_id fk)  -- N:N para atributos no ligados a variante
product_collections(product_id fk, collection_id fk) -- N:N
related_products(product_id fk, related_product_id fk)
```

Reglas:
- `subcategory_id` debe pertenecer al mismo `category_id` del producto — validar con constraint o trigger, no solo en frontend.
- "Descuento" y "más vendidos" y "novedades" **no son columnas persistidas manualmente**: se calculan (vista o query) desde `price`/`previous_price`, tabla de pedidos, y `created_at` respectivamente. Si ya existen como columnas manuales en el proyecto real, es un hallazgo de auditoría a reportar (riesgo de inconsistencia), no algo a replicar en nuevas features.

## Migraciones

- Todo cambio de esquema va en una migración versionada (carpeta de migraciones del proyecto), nunca como `ALTER`/`DROP` suelto ejecutado a mano contra la base.
- Cambios destructivos (`DROP COLUMN`, `DROP TABLE`, `TRUNCATE`) requieren, dentro de la misma migración o el mismo PR: comprobación de que no hay dependientes activos, y si hay datos existentes, un paso previo de backup/migración de datos antes del drop.
- Nombrar migraciones descriptivamente (`2025xxxxx_add_attribute_values_table.sql`), no `update.sql` genérico.

## Índices recomendados

- `products(category_id)`, `products(subcategory_id)`, `products(brand_id)` — filtros más comunes.
- `products(price)` — orden y filtro por rango.
- Índice compuesto o parcial para "más vendidos" si se materializa en una vista/tabla resumen en vez de calcularse en cada request.

## RLS (Row Level Security)

- Toda tabla nueva del catálogo: RLS activado desde su creación.
- Lectura pública (`select`) permitida para catálogo visible al público (productos activos, categorías activas).
- Escritura (`insert`/`update`/`delete`) restringida a rol autenticado/admin — nunca abierta con la anon key.
- Si un producto tiene estado "borrador"/inactivo, la policy de lectura pública debe excluirlo explícitamente, no depender de que el frontend filtre por conveniencia.

## Rendimiento en queries

- Nunca `select *` sobre `products` para listados — traer solo columnas necesarias para la card (nombre, precio, imagen principal, marca, badges calculados).
- Paginación con `range()`/cursor, no traer todo el catálogo y paginar en el cliente.
- Para "productos relacionados" y "también compraron", preferir una query acotada (misma subcategoría + atributos afines, o tabla `related_products` precomputada) sobre cálculos pesados en cada render.
