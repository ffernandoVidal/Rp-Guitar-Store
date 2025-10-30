# RP GUITAR - Sistema de Menú Centralizado

## 📁 Estructura del Proyecto

```
RP GUITAR/
├── index.html                  # Página principal
├── menu.js                     # ⭐ CONTENEDOR DE MENÚ CENTRALIZADO
├── nav.css                     # Estilos de navegación
├── styles.css                  # Estilos generales
├── nav.html                    # (Archivo original de referencia)
├── update-pages.ps1            # Script de actualización
├── accesorios/
│   └── index.html
├── marcas/
│   └── index.html
├── amplificadores/
│   └── index.html
├── suhr/
│   └── index.html
├── guitarras/
│   └── index.html
├── pedales/
│   └── index.html
├── bajos/
│   └── index.html
└── rp-music-school/
    └── index.html
```

## 🚀 Nuevo Sistema de Menú

### **¿Qué cambió?**
✅ **Antes:** Cada página tenía todo el código HTML del menú duplicado
✅ **Ahora:** Un solo archivo `menu.js` contiene toda la navegación

### **Archivo `menu.js`**
Contiene dos funciones principales:
- `createHomeNavigation()` - Para la página principal (index.html)
- `createNavigation()` - Para páginas internas (carpetas)
- `initializeMenu()` - Carga el menú y configura la funcionalidad

### **Cómo implementarlo en nuevas páginas:**

#### 1. En el HTML (reemplazar la navegación):
```html
<!-- En lugar de todo el <nav> -->
<div id="nav-container"></div>
```

#### 2. En el JavaScript (al final del body):
```html
<!-- JavaScript para el menú -->
<script src="../menu.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        initializeMenu(false); // false = página interna
    });
</script>
```

#### 3. Para la página principal (index.html):
```javascript
initializeMenu(true); // true = página principal
```

## ✨ Ventajas del Nuevo Sistema

### **1. Código más limpio**
- ❌ Antes: ~80 líneas de HTML por página
- ✅ Ahora: ~3 líneas por página

### **2. Mantenimiento fácil**
- **Un solo lugar** para actualizar el menú
- **Cambios automáticos** en todas las páginas
- **Consistencia garantizada**

### **3. Mejor organización**
- Separación clara entre contenido y navegación
- Archivos más pequeños y legibles
- Estructura modular

## 🛠️ Cómo actualizar el menú

Para agregar o modificar elementos del menú:

1. **Abrir** `menu.js`
2. **Editar** las funciones `createNavigation()` y `createHomeNavigation()`
3. **Guardar** - ¡Los cambios se aplican automáticamente a todas las páginas!

## 📱 Funcionalidad Incluida

✅ **Responsive design** completo
✅ **Menú hamburguesa** para móviles
✅ **Dropdowns funcionales** con hover
✅ **Navegación suave** entre secciones
✅ **Links automáticos** con rutas correctas

## 🔧 Páginas actualizadas

- ✅ `index.html` (página principal)
- ✅ `accesorios/index.html`
- ✅ `marcas/index.html` 
- ✅ `amplificadores/index.html`
- ✅ `suhr/index.html`
- ✅ `guitarras/index.html`
- ✅ `pedales/index.html`
- ✅ `bajos/index.html`
- ✅ `rp-music-school/index.html`

### ✅ ¡TODAS LAS PÁGINAS PRINCIPALES ACTUALIZADAS!

## 🎯 Próximos pasos

1. **Actualizar** las páginas restantes con el nuevo sistema
2. **Crear** las páginas secundarias (capos.html, straps.html, etc.)
3. **Personalizar** el contenido de cada sección
4. **Optimizar** SEO y performance

---

### 💡 **Nota importante:**
Este sistema hace que mantener y actualizar el sitio web sea mucho más eficiente. ¡Solo edita `menu.js` y los cambios se aplican a todo el sitio!