# Componente ProductCard

## Descripción
Componente reutilizable para mostrar tarjetas de productos en todas las páginas de catálogo. Basado en la estructura del producto "Cort CM15R Dark Blue".

## Ubicación
```
app/components/ProductCard.js
app/components/ProductCard.module.css
```

## Uso

### Importar el componente
```javascript
import ProductCard from '../components/ProductCard'
```

### Ejemplo básico
```javascript
<ProductCard product={producto} categoria="amplificadores" />
```

### En un grid de productos
```javascript
<div className={styles.grid}>
  {productos.map(producto => (
    <ProductCard 
      key={producto.id} 
      product={producto} 
      categoria="guitarras" 
    />
  ))}
</div>
```

## Props

### product (Object) - Requerido
Objeto del producto con la siguiente estructura:

```javascript
{
  id: "amp-001",                    // ID único
  nombre: "Cort CM15R Dark Blue",   // Nombre completo
  slug: "cort-cm15r-dark-blue",     // Slug para URL
  marca: "Cort",                    // Marca
  modelo: "CM15R",                  // Modelo
  precio: 1250,                     // Precio en número
  descripcion: "...",               // Descripción completa
  caracteristicas: [...],           // Array de características
  imagenes: [                       // Array de URLs de imágenes
    "/img/producto1.jpg",
    "/img/producto2.jpg"
  ],
  stock: true,                      // Disponibilidad
  categoria: "amplificadores"       // Categoría del producto
}
```

### categoria (String) - Opcional
Categoría para generar la URL correcta. Si no se proporciona, usa `product.categoria`.

Valores posibles:
- `"amplificadores"`
- `"guitarras"`
- `"accesorios"`
- `"pedales"`
- `"bajos"`

## Estructura Visual

```
┌─────────────────────────┐
│                         │
│     [IMAGEN 300x300]    │
│                         │
├─────────────────────────┤
│  Nombre del Producto    │
│  Marca Modelo           │
│  Q 1,250                │
│  [En stock]             │
└─────────────────────────┘
```

## Características

### Interactividad
- **Hover Effect**: La tarjeta se eleva y aumenta la sombra
- **Image Zoom**: La imagen hace zoom suave al hover
- **Click**: Toda la tarjeta es clickeable y redirige a la página del producto

### Responsive
- **Desktop**: 300px de altura de imagen
- **Tablet** (max-width: 768px): 250px de altura
- **Mobile** (max-width: 480px): Adaptación completa del padding y tamaños

### Stock Badge
- **Disponible**: Badge verde con texto "En stock"
- **No disponible**: No muestra badge

## Páginas que lo utilizan

1. **Amplificadores** (`app/amplificadores/page.js`)
   ```javascript
   <ProductCard product={amp} categoria="amplificadores" />
   ```

2. **Guitarras** (`app/guitarras/page.js`)
   ```javascript
   <ProductCard product={guitarra} categoria="guitarras" />
   ```

3. **Accesorios** (`app/accesorios/page.js`)
   ```javascript
   <ProductCard product={accesorio} categoria="accesorios" />
   ```

## Estilos CSS

### Clases principales
```css
.card              /* Contenedor principal */
.imageContainer    /* Contenedor de imagen */
.image             /* Imagen del producto */
.info              /* Información del producto */
.productName       /* Nombre del producto */
.brand             /* Marca y modelo */
.price             /* Precio */
.stock             /* Badge de disponibilidad */
```

## Rutas Generadas

El componente genera automáticamente la URL correcta:
```
/{categoria}/{product.slug}
```

Ejemplos:
- `/amplificadores/cort-cm15r-dark-blue`
- `/guitarras/dangelico-premier-dc`
- `/accesorios/gruvgear-fretwrap-sm-black`

## Ventajas

✅ **Consistencia**: Todos los productos se muestran con el mismo formato  
✅ **Reutilizable**: Un solo componente para todas las páginas  
✅ **Mantenible**: Cambios en un solo lugar afectan todo el sitio  
✅ **Escalable**: Fácil agregar nuevas categorías  
✅ **Responsive**: Adaptado a todos los dispositivos  
✅ **Accesible**: Estructura semántica correcta  

## Datos Fuente

Todos los productos provienen de:
```
/data/amplificadores.json
/public/data/amplificadores.json
```

## Formato de Precio

El precio se formatea automáticamente para Guatemala:
```javascript
precio.toLocaleString('es-GT')
// 1250 → "1,250"
```

## Manejo de Imágenes

- Primera imagen del array: `product.imagenes[0]`
- Fallback si no hay imagen: `/img/placeholder.jpg`
- Optimización: Next.js Image component
- Dimensiones: 300x300px (responsive)

## Ejemplo Completo

```javascript
'use client'
import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import ProductCard from '../components/ProductCard'
import styles from './catalogo.module.css'

export default function CatalogoPage() {
  const [productos, setProductos] = useState([])

  useEffect(() => {
    fetch('/data/amplificadores.json')
      .then(res => res.json())
      .then(data => {
        const filtrados = data.amplificadores.filter(
          item => item.categoria === 'amplificadores'
        )
        setProductos(filtrados)
      })
  }, [])

  return (
    <>
      <Navigation />
      <main>
        <div className={styles.container}>
          <h1>Catálogo</h1>
          <div className={styles.grid}>
            {productos.map(producto => (
              <ProductCard 
                key={producto.id}
                product={producto}
                categoria="amplificadores"
              />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
```

## Notas de Desarrollo

1. **No modificar directamente**: Si necesitas cambios, edita `ProductCard.js`
2. **Sincronización de datos**: Asegúrate que `public/data/amplificadores.json` esté actualizado
3. **Imágenes**: Verifica que las rutas de imágenes en el JSON sean correctas
4. **Testing**: Prueba en todas las páginas después de modificar el componente
