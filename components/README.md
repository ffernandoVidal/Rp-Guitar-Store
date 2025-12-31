# 🛒 RP GUITAR CART COMPONENT

## Descripción
Sistema de carrito de compras reutilizable para RP GUITAR con integración de WhatsApp. Permite agregar productos al carrito, gestionar pedidos y enviar automáticamente la información por WhatsApp.

## 📁 Archivos del Componente

### `cart.css`
Contiene todos los estilos necesarios para el carrito:
- Icono del carrito con contador
- Modales de carrito y checkout
- Formularios de cliente
- Animaciones y responsive design
- Estados de carga y notificaciones

### `cart.js`
Funcionalidad completa del carrito:
- Clase `RPGuitarCart` con toda la lógica
- Gestión de localStorage para persistencia
- Integración con WhatsApp Web
- Sistema de notificaciones
- Validación de formularios

### `cart-templates.html`
Plantillas HTML y ejemplos de uso:
- Templates para todos los elementos del carrito
- Ejemplos de integración con productos
- Documentación de uso

## 🚀 Instalación Rápida

### 1. Incluir los archivos en tu página
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <!-- Tus estilos existentes -->
    <link rel="stylesheet" href="components/cart.css">
</head>
<body>
    <!-- Tu contenido de la página -->
    
    <!-- JavaScript del carrito -->
    <script src="components/cart.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Inicializar el carrito
            initRPGuitarCart();
        });
    </script>
</body>
</html>
```

### 2. Configurar productos para el carrito

**Opción A: Data attributes en botones**
```html
<button class="btn-contact" 
        data-cart-add="true"
        data-cart-name="Telecaster American Professional II"
        data-cart-brand="Fender"
        data-cart-price="Q23,000"
        data-cart-image="img/telecaster.jpg"
        data-cart-specs="Cuerpo de Fresno | Mástil de Arce">
    Comprar Ahora
</button>
```

**Opción B: Data attributes en contenedor**
```html
<div class="product-card" 
     data-name="Telecaster American Professional II"
     data-brand="Fender"
     data-price="Q23,000"
     data-image="img/telecaster.jpg"
     data-specs="Cuerpo de Fresno | Mástil de Arce">
    
    <h3>Telecaster American Professional II</h3>
    <p>Fender</p>
    <p>Q23,000</p>
    <button class="btn-contact">Comprar Ahora</button>
</div>
```

## 🔧 Configuración Personalizada

```javascript
document.addEventListener('DOMContentLoaded', function() {
    initRPGuitarCart({
        whatsappNumber: '58468795',    // Tu número de WhatsApp
        storeName: 'RP GUITAR',           // Nombre de tu tienda
        currency: 'Q',                    // Símbolo de moneda
        storageKey: 'rpGuitarCart',       // Clave para localStorage
        ordersKey: 'rpGuitarOrders'       // Clave para historial de pedidos
    });
});
```

## 📱 Funcionalidades

### ✅ Carrito de Compras
- Agregar productos con un clic
- Mostrar contador de productos
- Ver resumen del carrito
- Eliminar productos individuales
- Vaciar carrito completo
- Persistencia con localStorage

### ✅ Sistema de Checkout
- Formulario de datos del cliente
- Campos obligatorios y opcionales
- Validación de datos
- Resumen del pedido antes de enviar

### ✅ Integración WhatsApp
- Envío automático por WhatsApp Web
- Mensaje formateado profesionalmente
- Información completa del cliente y productos
- Cálculo automático de totales
- Historial de pedidos en localStorage

### ✅ Notificaciones
- Confirmación de productos agregados
- Notificaciones de errores
- Estados de carga durante el envío

### ✅ Responsive Design
- Funciona en móviles y desktop
- Modales optimizados para touch
- Diseño adaptativo

## 🎯 Uso en Páginas Existentes

### Para Guitarras (como electricas.html)
El carrito detecta automáticamente los modales existentes:
```javascript
// No necesitas cambiar nada, el carrito detecta:
// - #modalGuitarName
// - #modalBrand  
// - #modalPrice
// - #modalImage
// - #modalSpecs li
```

### Para Pedales
Agrega data attributes a tus productos:
```html
<div class="pedal-card"
     data-name="Tube Screamer TS9"
     data-brand="Ibanez"
     data-price="Q850"
     data-image="img/ts9.jpg">
    <button class="btn-contact">Comprar Ahora</button>
</div>
```

### Para Amplificadores
```html
<div class="amp-card"
     data-name="Hot Rod Deluxe IV"
     data-brand="Fender"
     data-price="Q12,500"
     data-image="img/hotrod.jpg">
    <button class="btn-contact">Comprar Ahora</button>
</div>
```

## 🎨 Personalización de Estilos

El archivo `cart.css` usa variables CSS para fácil personalización:

```css
:root {
    --cart-primary: #ff6b35;
    --cart-secondary: #1a1a1a;
    --cart-success: #28a745;
    --cart-danger: #dc3545;
    --cart-warning: #ffc107;
}
```

## 📋 Estructura del Mensaje WhatsApp

El sistema genera mensajes profesionales como este:

```
🎸 *NUEVO PEDIDO RP GUITAR*

👤 *DATOS DEL CLIENTE:*
📝 Nombre: Juan Pérez
📞 Teléfono: 5555-5555
📧 Email: juan@email.com
🏠 Dirección: Zona 10, Guatemala

📅 Fecha: 15/12/2023
⏰ Hora: 14:30:00

🛒 *PRODUCTOS SOLICITADOS:*

1. *Telecaster American Professional II*
   🏷️ Marca: Fender
   💰 Precio: Q23,000
   📋 Especificaciones: Cuerpo de Fresno | Mástil de Arce

2. *Tube Screamer TS9*
   🏷️ Marca: Ibanez
   💰 Precio: Q850

💵 *TOTAL ESTIMADO: Q23,850*

✨ ¡Gracias por elegir RP GUITAR! 🎵
```

## 🔍 Solución de Problemas

### El carrito no aparece
- Verifica que `cart.css` y `cart.js` estén incluidos
- Asegúrate de llamar `initRPGuitarCart()` después de DOMContentLoaded

### Los productos no se agregan
- Verifica que los botones tengan la clase `btn-contact` o `btn-add-cart`
- Asegúrate de que los data attributes estén correctos
- Revisa la consola del navegador para errores

### WhatsApp no se abre
- Verifica que el número de WhatsApp sea correcto
- Asegúrate de que el formato sea: `58468795` (sin +, espacios o guiones)

### Los estilos no se aplican
- Verifica que `cart.css` se cargue antes que `cart.js`
- Asegúrate de que no haya conflictos con otros CSS

## 🚀 Integración en Nuevas Páginas

### 1. Copiar archivos
```
tu-pagina/
├── components/
│   ├── cart.css
│   ├── cart.js
│   └── cart-templates.html
├── tu-pagina.html
└── tu-script.js
```

### 2. Incluir en HTML
```html
<link rel="stylesheet" href="components/cart.css">
<script src="components/cart.js"></script>
```

### 3. Inicializar en JavaScript
```javascript
document.addEventListener('DOMContentLoaded', function() {
    initRPGuitarCart();
});
```

### 4. Configurar productos
Agregar data attributes según el tipo de producto.

## 📞 Soporte

Para cualquier duda sobre la implementación:
- Revisa los ejemplos en `cart-templates.html`
- Verifica la configuración en el navegador
- Consulta la consola para errores de JavaScript

---

**RP GUITAR CART COMPONENT v1.0.0**  
*Sistema de carrito modular para e-commerce musical* 🎸