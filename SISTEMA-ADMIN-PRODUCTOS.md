# Sistema de Administración de Productos RP GUITAR

## 🎯 Descripción General

Sistema completo de gestión de inventario y productos para la tienda RP GUITAR, con autenticación segura, formularios de carga, manejo de imágenes y control automático de stock.

## 🔐 Credenciales de Acceso

- **Código:** `0002`
- **Contraseña:** `RP77`

## 📋 Características Principales

### 1. Sistema de Autenticación
- Login seguro con JWT (JSON Web Tokens)
- Sesiones de 8 horas de duración
- Protección de rutas administrativas
- Contraseñas encriptadas con bcrypt

### 2. Gestión de Productos
- **Crear productos nuevos** con toda la información necesaria
- **Editar productos existentes** manteniendo el historial
- **Eliminar productos** del inventario
- **Búsqueda y filtros** por categoría, marca o texto libre

### 3. Control de Inventario
- **Stock automático:** Suma cuando agregas más productos
- **Resta automática:** Al hacer una venta se descuenta del stock
- **Alertas de stock:** Indicadores visuales (bajo, medio, alto)
- **Validación:** No permite ventas si no hay stock suficiente

### 4. Precios Diferenciados
- **Precio de Venta:** Visible para todos los usuarios
- **Precio Mayorista:** Solo visible en el panel de administración
- Los usuarios finales no pueden ver el precio mayorista

### 5. Gestión de Imágenes
- **Subida múltiple:** Sube varias imágenes por producto
- **Formatos:** JPG, PNG, WEBP, GIF
- **Límite:** 5MB por imagen
- **Organización:** Imágenes guardadas por categoría
- **Preview:** Vista previa antes de guardar

### 6. Categorización
El sistema está organizado según el menú de la tienda:
- 🎸 Guitarras
- 🎛️ Pedales
- 🔊 Amplificadores
- 🎸 Bajos
- 🎵 Accesorios

### 7. Marcas Disponibles
Lista completa de marcas incluyendo:
- PRS, Suhr, D'Angelico, Danelectro, Fender, Gibson
- Ibanez, Jackson, ESP, Schecter, Gretsch
- Boss, MXR, Electro-Harmonix, TC Electronic, Walrus Audio
- Strymon, JHS, Wampler, EarthQuaker Devices
- Marshall, Vox, Orange, Mesa Boogie, Blackstar
- Y más...

## 🚀 Cómo Usar el Sistema

### Paso 1: Acceder al Panel
1. Ir a `/admin` o hacer clic en el botón de administración
2. Ingresar código: `0002`
3. Ingresar contraseña: `RP77`
4. Click en "Iniciar Sesión"

### Paso 2: Agregar un Nuevo Producto

1. **Información Básica (Requerida)**
   - Nombre del producto
   - Marca (seleccionar de la lista)
   - Categoría (guitarras, pedales, etc.)
   - Stock inicial
   - Precio de venta
   - Precio mayorista (opcional)

2. **Descripciones**
   - Descripción corta: Para listados
   - Descripción detallada: Para la página individual del producto

3. **Especificaciones Técnicas**
   - Tipo (Eléctrica, Acústica, etc.)
   - Cuerpo (material)
   - Mástil (material)
   - Diapasón (material)
   - Otras especificaciones

4. **Imágenes**
   - Click en el área de subida de imágenes
   - Seleccionar una o más imágenes
   - Esperar a que se suban
   - Puedes eliminar imágenes con el botón ×

5. **Guardar**
   - Click en "Guardar Producto"
   - Aparecerá un mensaje de confirmación

### Paso 3: Ver Lista de Productos

1. Click en la pestaña "Lista de Productos"
2. Verás todos los productos con:
   - Imagen principal
   - Información básica
   - Stock actual con código de colores:
     - 🔴 Rojo: Sin stock (0)
     - 🟡 Amarillo: Stock bajo (< 5)
     - 🟢 Verde: Stock disponible (≥ 5)
   - Botones de Editar y Eliminar

### Paso 4: Editar un Producto

1. En la lista de productos, click en "Editar"
2. Se cargará el formulario con los datos actuales
3. Modificar los campos necesarios
4. Click en "Actualizar Producto"

### Paso 5: Actualizar Stock

**Opción A: Desde el formulario de edición**
- Editar el producto
- Cambiar el número en el campo "Stock"
- El sistema REEMPLAZA el valor (no suma)

**Opción B: Mediante API (para desarrolladores)**
```javascript
// Sumar stock
POST /api/productos/stock
{
  "id": "prod-1",
  "cantidad": 5,
  "operacion": "sumar"
}

// Restar stock
POST /api/productos/stock
{
  "id": "prod-1",
  "cantidad": 1,
  "operacion": "restar"
}
```

## 🔌 API Endpoints

### Autenticación

#### POST `/api/auth/login`
Iniciar sesión como administrador
```json
{
  "codigo": "0002",
  "password": "RP77"
}
```

#### GET `/api/auth/verify`
Verificar token JWT (enviar en header: `Authorization: Bearer <token>`)

### Productos

#### GET `/api/productos`
Obtener todos los productos
- Query params:
  - `id`: ID específico
  - `categoria`: Filtrar por categoría
  - `q`: Búsqueda por texto
  - `includePrivate=true`: Incluir precios mayoristas (requiere auth)

#### POST `/api/productos` 🔒
Crear nuevo producto (requiere autenticación)
```json
{
  "nombre": "Fender Stratocaster",
  "marca": "Fender",
  "categoria": "guitarras",
  "stock": 5,
  "precioVenta": 15000,
  "precioMayorista": 12000,
  "descripcion": "Guitarra eléctrica clásica",
  "imagenes": ["/img/guitarras/strat.jpg"],
  "especificaciones": {
    "tipo": "Eléctrica",
    "cuerpo": "Aliso",
    "mastil": "Arce"
  }
}
```

#### PUT `/api/productos` 🔒
Actualizar producto existente (requiere autenticación)
```json
{
  "id": "prod-1",
  "stock": 10,
  "precioVenta": 16000
}
```

#### DELETE `/api/productos?id=prod-1` 🔒
Eliminar producto (requiere autenticación)

### Stock

#### GET `/api/productos/stock?id=prod-1`
Obtener stock de un producto

#### POST `/api/productos/stock` 🔒
Actualizar stock (requiere autenticación)
```json
{
  "id": "prod-1",
  "cantidad": 5,
  "operacion": "restar" // o "sumar"
}
```

### Imágenes

#### POST `/api/productos/upload` 🔒
Subir imagen (requiere autenticación)
- Content-Type: multipart/form-data
- Fields:
  - `imagen`: archivo
  - `categoria`: categoría del producto

### Ventas

#### POST `/api/ventas`
Registrar venta (automáticamente resta stock)
```json
{
  "cliente": "Juan Pérez",
  "productos": [
    {
      "id": "prod-1",
      "nombre": "Fender Stratocaster",
      "cantidad": 1,
      "precio": 15000
    }
  ],
  "total": 15000
}
```

## 📁 Estructura de Base de Datos

### Productos (`data/productos.json`)
```json
{
  "productos": [
    {
      "id": "prod-1",
      "nombre": "Fender Stratocaster",
      "marca": "Fender",
      "categoria": "guitarras",
      "stock": 5,
      "precioVenta": 15000,
      "precioMayorista": 12000,
      "descripcion": "Guitarra eléctrica clásica",
      "descripcionDetallada": "Descripción completa...",
      "especificaciones": {
        "tipo": "Eléctrica",
        "cuerpo": "Aliso",
        "mastil": "Arce",
        "diapason": "Palisandro",
        "otros": "3 micrófonos simples..."
      },
      "imagenes": [
        "/img/guitarras/strat1.jpg",
        "/img/guitarras/strat2.jpg"
      ],
      "fechaCreacion": "2025-12-31T10:00:00.000Z",
      "fechaModificacion": "2025-12-31T15:30:00.000Z"
    }
  ],
  "nextId": 2
}
```

### Ventas (`data/ventas.json`)
```json
{
  "ventas": [
    {
      "id": 1,
      "cliente": "Juan Pérez",
      "productos": [...],
      "total": 15000,
      "fechaRegistro": "2025-12-31T16:00:00.000Z",
      "productosActualizados": [
        {
          "id": "prod-1",
          "nombre": "Fender Stratocaster",
          "stockAnterior": 5,
          "stockNuevo": 4,
          "cantidadVendida": 1
        }
      ]
    }
  ],
  "nextId": 2
}
```

## 🎨 Interfaz de Usuario

### Panel de Administración
- **Header:** Título y botón de cerrar sesión
- **Pestañas:**
  - ➕ Nuevo Producto: Formulario de carga
  - 📦 Lista de Productos: Vista de todos los productos

### Página de Login
- Diseño moderno con gradiente púrpura
- Formulario centrado y responsive
- Mensajes de error claros
- Link para volver a la tienda

### Colores y Diseño
- **Principal:** Gradiente púrpura (#667eea → #764ba2)
- **Stock Bajo:** Rojo (#ff4757)
- **Stock Medio:** Naranja (#ffa502)
- **Stock Alto:** Verde (#26de81)
- **Fondo:** Gris claro (#f5f5f5)

## 🔒 Seguridad

1. **Autenticación JWT:** Tokens con expiración de 8 horas
2. **Contraseñas:** Encriptadas con bcrypt (salt rounds: 10)
3. **Rutas protegidas:** Middleware verifica token en cada petición
4. **Validación:** Verificación de datos en backend
5. **CORS:** Configurado para el dominio de la tienda

## 📝 Archivos Creados

### Backend
- `lib/db-productos.js` - Funciones de base de datos para productos
- `lib/auth.js` - Sistema de autenticación y JWT
- `app/api/auth/login/route.js` - Endpoint de login
- `app/api/auth/verify/route.js` - Verificación de tokens
- `app/api/productos/route.js` - CRUD de productos
- `app/api/productos/stock/route.js` - Gestión de stock
- `app/api/productos/upload/route.js` - Subida de imágenes
- `app/api/ventas/route.js` - Registro de ventas (actualizado)

### Frontend
- `app/admin/page.js` - Página de login
- `app/admin/login.module.css` - Estilos del login
- `app/admin/productos/page.js` - Panel de administración
- `app/admin/productos/productos.module.css` - Estilos del panel

## 🚦 Estado del Stock

El sistema muestra el estado del stock con códigos de colores:

- **🟢 Verde (Stock Alto):** 5 o más unidades
- **🟡 Amarillo (Stock Medio):** 1-4 unidades
- **🔴 Rojo (Stock Bajo):** 0 unidades

## ⚠️ Validaciones

- Stock no puede ser negativo
- No se puede vender sin stock suficiente
- Imágenes limitadas a 5MB
- Solo formatos de imagen válidos
- Campos requeridos marcados con *

## 🔄 Flujo de Venta

1. Usuario realiza una compra
2. Sistema verifica stock disponible
3. Si hay stock → Registra venta y resta automáticamente
4. Si no hay stock → Muestra error "Stock insuficiente"
5. Guarda historial de cambios en la venta

## 📱 Responsive

- Formularios adaptables a móviles
- Grid responsivo en listas
- Navegación optimizada para touch
- Imágenes con carga optimizada

## 🎯 Próximas Mejoras Sugeridas

1. Dashboard con estadísticas de ventas
2. Reportes de inventario en PDF/Excel
3. Historial de cambios de stock
4. Notificaciones de stock bajo
5. Importación masiva de productos (CSV)
6. Sistema de categorías personalizadas
7. Multi-idioma
8. API de sincronización con otros sistemas

## 🛠️ Dependencias Instaladas

```json
{
  "bcryptjs": "^2.4.3",      // Encriptación de contraseñas
  "jsonwebtoken": "^9.0.2",  // Tokens JWT
  "formidable": "^3.5.1",    // Manejo de formularios
  "uuid": "^9.0.1"           // Generación de IDs únicos
}
```

## 📞 Soporte

Para cualquier duda o problema con el sistema, revisar los logs en la consola del navegador y del servidor.

---

**Desarrollado para RP GUITAR Store**
*Sistema de Gestión de Inventario v1.0*
