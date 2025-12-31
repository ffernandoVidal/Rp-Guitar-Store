# 🎸 Sistema de Administración de Productos - Guía Rápida

## ✅ Sistema Completado

El sistema de administración de productos está completamente funcional con todas las características solicitadas.

## 🚀 Inicio Rápido

### 1. Acceder al Panel de Administración

**URL:** http://localhost:3000/admin

**Credenciales:**
- Código: `0002`
- Contraseña: `RP77`

### 2. Funciones Principales

#### ➕ Agregar Productos
1. Accede al panel con las credenciales
2. Completa el formulario con:
   - Nombre del producto (requerido)
   - Marca (requerido)
   - Categoría (requerido)
   - Stock (requerido)
   - Precio de venta (requerido)
   - Precio mayorista (opcional, solo visible para admin)
   - Descripciones
   - Especificaciones técnicas
   - Imágenes (múltiples)
3. Click en "Guardar Producto"

#### 📦 Ver y Gestionar Inventario
1. Click en pestaña "Lista de Productos"
2. Verás todos los productos con:
   - Imágenes
   - Información completa
   - Stock actual con colores:
     - 🔴 Sin stock (0)
     - 🟡 Stock bajo (1-4)
     - 🟢 Stock disponible (5+)
3. Opciones:
   - **Editar:** Modificar cualquier dato del producto
   - **Eliminar:** Borrar producto del inventario

#### 📸 Subir Imágenes
1. En el formulario de producto
2. Click en área de "Click para subir imágenes"
3. Selecciona una o varias imágenes (JPG, PNG, WEBP, GIF)
4. Máximo 5MB por imagen
5. Las imágenes se suben automáticamente
6. Puedes eliminar con el botón ×

#### 💰 Gestión de Stock

**Agregar Stock:**
- Edita el producto
- Modifica el campo "Stock" con el nuevo total
- El sistema actualiza la cantidad

**Stock Automático en Ventas:**
- Cuando se registra una venta
- El sistema resta automáticamente del inventario
- No permite ventas sin stock suficiente

## 📋 Características Especiales

### 🔐 Seguridad
- Autenticación con JWT
- Sesión de 8 horas
- Contraseñas encriptadas
- Rutas protegidas

### 💵 Precios Diferenciados
- **Precio Venta:** Visible públicamente
- **Precio Mayorista:** Solo visible en el panel admin
- Los usuarios no pueden ver el precio mayorista

### 📂 Organización por Categorías
- Guitarras
- Pedales
- Amplificadores
- Bajos
- Accesorios

### 🏷️ Marcas Disponibles
PRS, Suhr, D'Angelico, Danelectro, Fender, Gibson, Ibanez, Jackson, ESP, Schecter, Boss, MXR, Electro-Harmonix, Walrus Audio, Marshall, Vox, Orange, y más...

## 🗂️ Estructura de Datos

Cada producto incluye:
- ✅ Nombre
- ✅ Marca (lista predefinida)
- ✅ Categoría (según menú de la página)
- ✅ Stock (suma/resta automática)
- ✅ Precio de venta
- ✅ Precio mayorista (privado)
- ✅ Descripciones (corta y detallada)
- ✅ Especificaciones técnicas completas
- ✅ Múltiples imágenes
- ✅ Fecha de creación y modificación

## 🔄 Integración con Ventas

El sistema está integrado con el módulo de ventas:
- Al registrar una venta, el stock se descuenta automáticamente
- Valida que haya stock suficiente antes de vender
- Guarda historial de cambios de inventario
- Muestra error si no hay stock disponible

## 📱 Accesos Directos

| Función | URL |
|---------|-----|
| Login Admin | http://localhost:3000/admin |
| Panel Productos | http://localhost:3000/admin/productos |
| Tienda Principal | http://localhost:3000 |

## 📊 Base de Datos

Los datos se guardan en archivos JSON:
- `data/productos.json` - Inventario de productos
- `data/ventas.json` - Registro de ventas
- `public/img/[categoria]/` - Imágenes de productos

## ⚠️ Notas Importantes

1. **Primera vez:** El archivo `productos.json` se crea automáticamente
2. **Imágenes:** Se guardan en `public/img/` por categoría
3. **Stock:** Siempre muestra el valor actual en tiempo real
4. **Sesión:** Expira después de 8 horas de inactividad
5. **Responsive:** Funciona en desktop, tablet y móvil

## 🛠️ Si algo no funciona

1. Verifica que el servidor esté corriendo: `npm run dev`
2. Revisa la consola del navegador (F12)
3. Verifica que la carpeta `data/` exista
4. Asegúrate de usar las credenciales correctas

## 📝 Archivos Principales

```
app/
  admin/
    page.js                    # Login
    login.module.css
    productos/
      page.js                  # Panel principal
      productos.module.css
  api/
    auth/
      login/route.js           # Autenticación
      verify/route.js          # Verificar token
    productos/
      route.js                 # CRUD productos
      stock/route.js           # Gestión stock
      upload/route.js          # Subir imágenes
    ventas/
      route.js                 # Ventas (actualizado)
lib/
  db-productos.js              # Base de datos
  auth.js                      # Sistema auth
```

## ✨ Todo Listo!

El sistema está completamente funcional. Puedes:
1. Iniciar sesión
2. Agregar productos
3. Subir imágenes
4. Gestionar inventario
5. Las ventas descuentan automáticamente del stock

**Documentación completa:** Ver archivo `SISTEMA-ADMIN-PRODUCTOS.md`

---

**RP GUITAR Store - Sistema de Gestión v1.0**
