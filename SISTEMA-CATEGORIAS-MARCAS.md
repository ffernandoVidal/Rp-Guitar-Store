# Sistema de Categorías y Organización en el Menú

## Última actualización: 31 de diciembre de 2025

## 📋 Categorías Disponibles

El panel administrativo ahora incluye todas las categorías del menú principal y submenú:

### Categorías Principales

1. **Guitarras** (`guitarras`)
   - Aparece en: `/guitarras`
   - Menú: Link directo "Guitarras"

2. **Pedales** (`pedales`)
   - Aparece en: `/pedales`
   - Menú: Link directo "Pedales"

3. **Amplificadores** (`amplificadores`)
   - Aparece en: `/amplificadores`
   - Menú: Link directo "Amplificadores"

4. **Bajos** (`bajos`)
   - Aparece en: `/bajos`
   - Menú: Link directo "Bajos"

5. **Accesorios** (`accesorios`)
   - Aparece en: `/accesorios`
   - Menú: Dropdown "Accesorios" (ver todos)

### Subcategorías de Accesorios

6. **Capos** (`accesorios-capos`)
   - Aparece en: `/accesorios/capos`
   - Menú: Accesorios › Capos

7. **Straps** (`accesorios-straps`)
   - Aparece en: `/accesorios/straps`
   - Menú: Accesorios › Straps

8. **Cuerdas** (`accesorios-cuerdas`)
   - Aparece en: `/accesorios/cuerdas`
   - Menú: Accesorios › Cuerdas

9. **Vega Trem** (`accesorios-vega-trem`)
   - Aparece en: `/accesorios/vega-trem`
   - Menú: Accesorios › Vega Trem

10. **Pedestales** (`accesorios-pedestales`)
    - Aparece en: `/accesorios/pedestales`
    - Menú: Accesorios › Pedestales

11. **Fuentes de Poder** (`accesorios-fuentes-poder`)
    - Aparece en: `/accesorios/fuentes-poder`
    - Menú: Accesorios › Fuentes de poder

## 🏷️ Sistema de Marcas Dinámicas

Las marcas ya no están hardcodeadas. Ahora se generan automáticamente desde los productos existentes:

### Funcionamiento

1. **Extracción Automática**: El sistema lee todos los productos y extrae las marcas únicas
2. **Ordenamiento**: Las marcas se ordenan alfabéticamente en español
3. **Marca "Otra"**: Siempre aparece al final de la lista para marcas no convencionales
4. **Actualización en Tiempo Real**: Al agregar un producto con una marca nueva, esta aparece automáticamente en el selector

### API Endpoint

```
GET /api/productos/marcas
```

**Respuesta:**
```json
[
  "Cort",
  "D'Angelico",
  "Danelectro",
  "Ernie Ball",
  "Gruvgear",
  "PRS",
  "Rivolta",
  "Suhr",
  "Supro",
  "Otra"
]
```

## 📂 Cómo Funciona la Organización

### Proceso de Categorización

1. **Crear Producto**: Al crear un producto, seleccionas una categoría
2. **Guardado**: El producto se guarda con su categoría en `data/amplificadores.json`
3. **Filtrado**: Cada página filtra productos por su categoría
4. **Visualización**: Los productos aparecen en la página correspondiente

### Ejemplo de Flujo

```
1. Admin crea producto:
   - Nombre: "Capo Jim Dunlop"
   - Marca: "Jim Dunlop"
   - Categoría: "accesorios-capos"
   
2. Producto se guarda:
   {
     "nombre": "Capo Jim Dunlop",
     "marca": "Jim Dunlop",
     "categoria": "accesorios-capos",
     ...
   }

3. Página lee datos:
   - /accesorios/capos/page.js filtra por categoria === "accesorios-capos"
   
4. Usuario ve producto:
   - Navega a: Accesorios › Capos
   - Ve el producto listado
```

## 🔄 Migración de Categorías Antiguas

Si tienes productos con categorías antiguas, puedes editarlos en el panel administrativo:

### Categorías Antiguas → Nuevas

- `accesorios` (general) → Usar subcategoría específica
  - Si es capo → `accesorios-capos`
  - Si es strap → `accesorios-straps`
  - Si es cuerda → `accesorios-cuerdas`
  - etc.

## 📌 Notas Importantes

1. **Categoría es obligatoria**: Todos los productos deben tener una categoría
2. **Determina ubicación**: La categoría determina exactamente dónde aparece el producto en el sitio
3. **Una sola categoría**: Un producto solo puede estar en una categoría a la vez
4. **Marca dinámica**: Si tu marca no está en la lista, selecciona "Otra" y el sistema la agregará
5. **Sin duplicados**: El sistema previene marcas duplicadas automáticamente

## 🛠️ Configuración Técnica

### Archivo de Configuración
```javascript
// app/admin/productos/page.js
const CATEGORIAS = {
  // Categorías principales
  guitarras: 'Guitarras',
  pedales: 'Pedales',
  amplificadores: 'Amplificadores',
  bajos: 'Bajos',
  accesorios: 'Accesorios',
  
  // Subcategorías de Accesorios
  'accesorios-capos': 'Accesorios › Capos',
  'accesorios-straps': 'Accesorios › Straps',
  'accesorios-cuerdas': 'Accesorios › Cuerdas',
  'accesorios-vega-trem': 'Accesorios › Vega Trem',
  'accesorios-pedestales': 'Accesorios › Pedestales',
  'accesorios-fuentes-poder': 'Accesorios › Fuentes de Poder'
}
```

### API de Marcas
```javascript
// app/api/productos/marcas/route.js
// Extrae marcas únicas de todos los productos
// Ordena alfabéticamente con "Otra" al final
```

## 🎯 Mejores Prácticas

1. **Categorías Específicas**: Usa la categoría más específica posible
   - ✅ Correcto: `accesorios-capos` para un capo
   - ❌ Incorrecto: `accesorios` para un capo

2. **Marcas Consistentes**: Usa la marca exacta como aparece en el producto
   - ✅ Correcto: "D'Angelico"
   - ❌ Incorrecto: "dangelico", "D Angelico"

3. **Nuevas Marcas**: Al agregar marca nueva, escríbela correctamente
   - El sistema la agregará automáticamente al selector
   - Aparecerá ordenada alfabéticamente

4. **Revisión de Categorías**: Revisa que los productos estén en la categoría correcta
   - Usa el tab "Lista de Productos" para verificar
   - Edita productos si están mal categorizados

## 📞 Soporte

Para agregar nuevas categorías al menú:
1. Actualizar `CATEGORIAS` en `app/admin/productos/page.js`
2. Crear página correspondiente en `app/[categoria]/page.js`
3. Actualizar menú en `app/components/Navigation.js`
