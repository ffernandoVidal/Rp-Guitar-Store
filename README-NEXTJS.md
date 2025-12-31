# RP GUITAR - Next.js Store

Tienda de guitarras y accesorios musicales construida con Next.js 14+ y Server Side Rendering (SSR).

## 🚀 Características

- ✅ **Next.js 14** con App Router
- ✅ **Server Side Rendering (SSR)** para mejor SEO
- ✅ **React Components** modernos
- ✅ **CSS Modules** para estilos encapsulados
- ✅ **Image Optimization** con next/image
- ✅ **Rutas dinámicas** para productos
- ✅ **Responsive Design** para mobile y desktop

## 📁 Estructura del Proyecto

```
RP GUITAR/
├── app/
│   ├── components/           # Componentes reutilizables
│   │   ├── Navigation.js    # Menú de navegación
│   │   ├── Carousel.js      # Carrusel de imágenes
│   │   └── ProductCard.js   # Tarjeta de producto
│   ├── guitarras/           # Página de guitarras
│   ├── pedales/             # Página de pedales
│   ├── amplificadores/      # Página de amplificadores
│   ├── bajos/               # Página de bajos
│   ├── accesorios/          # Página de accesorios
│   ├── marcas/              # Página de marcas
│   ├── suhr/                # Página exclusiva Suhr
│   ├── rp-music-school/     # Página de academia
│   ├── productos/[slug]/    # Ruta dinámica para productos
│   ├── layout.js            # Layout principal
│   ├── page.js              # Página de inicio
│   └── globals.css          # Estilos globales
├── public/
│   ├── img/                 # Imágenes y assets
│   └── robots.txt
├── package.json
├── next.config.js
└── README-NEXTJS.md

```

## 🛠️ Instalación y Uso

### Requisitos previos
- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Iniciar en producción
npm start
```

El servidor de desarrollo estará disponible en [http://localhost:3000](http://localhost:3000)

## 📄 Páginas Disponibles

- `/` - Página principal con carrusel
- `/guitarras` - Catálogo de guitarras con SSR
- `/pedales` - Catálogo de pedales con SSR
- `/amplificadores` - Catálogo de amplificadores con SSR
- `/bajos` - Catálogo de bajos con SSR
- `/accesorios` - Catálogo de accesorios con SSR
- `/marcas` - Página de marcas representadas
- `/suhr` - Página exclusiva de productos Suhr
- `/rp-music-school` - Academia de música
- `/productos/[slug]` - Página de producto individual (dinámica)

## 🎨 Componentes

### Navigation
Menú de navegación con dropdown y responsive design. Usa Next.js Link para navegación optimizada.

### Carousel
Carrusel de imágenes con autoplay, controles y dots indicadores.

### ProductCard
Componente reutilizable para mostrar productos con imagen, descripción, precio y botón de acción.

## 🔄 Server Side Rendering (SSR)

Todas las páginas usan SSR por defecto con funciones `async` en los componentes de página:

```javascript
async function getProductos() {
  // Fetch data from API or database
  return productos
}

export default async function ProductosPage() {
  const productos = await getProductos()
  return <div>{/* render productos */}</div>
}
```

## 📱 Responsive Design

El diseño es completamente responsive con breakpoints en:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎯 Próximos Pasos

1. Conectar con API real o base de datos
2. Implementar carrito de compras
3. Agregar sistema de autenticación
4. Integrar pasarela de pagos
5. Agregar más páginas de productos individuales
6. Implementar búsqueda y filtros
7. Agregar reviews y ratings

## 📝 Notas de Desarrollo

- Los archivos HTML originales se mantienen en la raíz para referencia
- Las imágenes están en `public/img/`
- Los estilos usan CSS Modules para evitar conflictos
- Cada página tiene metadata optimizada para SEO

## 🤝 Contribuir

Este proyecto está en desarrollo activo. Las contribuciones son bienvenidas.

## 📄 Licencia

© 2025 RP GUITAR. Todos los derechos reservados.
