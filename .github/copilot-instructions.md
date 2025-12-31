# Copilot Instructions - RP Guitar Store Next.js Migration

## Project Overview
Tienda de guitarras y accesorios musicales construida con Next.js 14+ y SSR (Server Side Rendering).

## Checklist

- [x] Verify copilot-instructions.md file created
- [x] Clarify project requirements (Next.js with JavaScript for guitar e-commerce)
- [x] Scaffold Next.js project
- [x] Migrate HTML content to React components
- [x] Configure routing and pages
- [x] Migrate styles and assets
- [x] Install dependencies and compile
- [x] Create and run development task
- [x] Test project functionality
- [x] Create documentation
- [x] Sistema de administración de productos
- [x] Sistema de autenticación para admin
- [x] Gestión de inventario automática
- [x] Sistema de subida de imágenes
- [x] Integración con sistema de ventas

## ✅ Current Status

**El proyecto Next.js está completamente funcional y corriendo en http://localhost:3000**

### Implemented
- ✅ Next.js 14.2 con App Router
- ✅ Server Side Rendering en todas las páginas
- ✅ Componentes React (Navigation, Carousel, ProductCard)
- ✅ 9 páginas principales con SSR
- ✅ Rutas dinámicas para productos individuales
- ✅ CSS Modules para todos los estilos
- ✅ Responsive design completo
- ✅ Metadata SEO optimizada
- ✅ **Sistema de Administración de Productos**
- ✅ **Autenticación segura con JWT**
- ✅ **Control de inventario automático**
- ✅ **Precios diferenciados (venta/mayorista)**
- ✅ **Sistema de subida de imágenes**
- ✅ **Integración con ventas**

### Pages Created
1. `/` - Página principal con carrusel
2. `/guitarras` - Catálogo de guitarras
3. `/pedales` - Catálogo de pedales
4. `/amplificadores` - Catálogo de amplificadores
5. `/bajos` - Catálogo de bajos
6. `/accesorios` - Catálogo de accesorios
7. `/marcas` - Página de marcas
8. `/suhr` - Página exclusiva Suhr
9. `/rp-music-school` - Academia de música
10. `/productos/[slug]` - Ruta dinámica para productos
11. `/admin` - Login de administrador ⭐ NUEVO
12. `/admin/productos` - Panel de gestión de productos ⭐ NUEVO

## Admin Panel Access
- **URL:** http://localhost:3000/admin
- **Código:** `0002`
- **Contraseña:** `RP77`
- **Documentación:** Ver `SISTEMA-ADMIN-PRODUCTOS.md` y `ADMIN-QUICKSTART.md`

## Project Requirements
- Next.js 14+ with App Router ✅
- JavaScript (no TypeScript) ✅
- CSS Modules for styling ✅
- Image optimization with next/image ✅
- Dynamic routing for product pages ✅
- Responsive design ✅
- SEO optimization ✅

## Next Steps

### Phase 2 - Data & Content
- [ ] Conectar con API o base de datos
- [ ] Migrar productos reales desde HTML existente
- [ ] Agregar más imágenes de productos
- [ ] Crear más páginas de productos individuales

### Phase 3 - Features
- [ ] Implementar carrito de compras (Context API)
- [ ] Sistema de búsqueda y filtros
- [ ] Integración con WhatsApp
- [ ] Newsletter y formularios de contacto

### Phase 4 - Advanced
- [ ] Sistema de autenticación
- [ ] Panel de administración
- [ ] Integración con pasarela de pagos
- [ ] Analytics y tracking

## Key Files

### Components
- `app/components/Navigation.js` - Menú principal responsive
- `app/components/Carousel.js` - Carrusel de imágenes
- `app/components/ProductCard.js` - Tarjeta de producto reutilizable

### Pages
All pages use SSR with async functions:
```javascript
async function getData() {
  return data
}

export default async function Page() {
  const data = await getData()
  return <div>...</div>
}
```

### Commands
```bash
npm run dev    # Development server (running)
npm run build  # Production build
npm start      # Production server
```

## Documentation
- `NEXT-SETUP.md` - Guía de inicio rápido
- `README-NEXTJS.md` - Documentación técnica completa

