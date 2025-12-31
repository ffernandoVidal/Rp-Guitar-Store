# Guía de Despliegue - RP GUITAR

## 📋 Checklist Pre-Despliegue

### 1. Actualizar Información de Contacto
- [ ] Actualizar teléfono en `footer.js`
- [ ] Actualizar email en `footer.js`
- [ ] Agregar links de redes sociales en `footer.js`
- [ ] Actualizar número de WhatsApp en `components/cart.js`

### 2. Contenido
- [ ] Reemplazar imágenes placeholder con fotos reales
- [ ] Verificar precios de todos los productos
- [ ] Revisar descripciones de productos
- [ ] Agregar productos faltantes

### 3. Pruebas
- [ ] Probar navegación en todas las páginas
- [ ] Probar carrito de compras
- [ ] Verificar envío de WhatsApp desde carrito
- [ ] Probar en móviles (responsive)
- [ ] Probar en diferentes navegadores

### 4. SEO
- [ ] Agregar meta tags a páginas restantes
- [ ] Crear archivo `robots.txt`
- [ ] Crear archivo `sitemap.xml` (opcional)

## 🚀 Opciones de Despliegue

### Opción 1: GitHub Pages (GRATIS)

#### Ventajas
- Hosting gratuito
- Fácil de configurar
- URL automática: `usuario.github.io/rpguitar`
- Soporte SSL automático (HTTPS)

#### Pasos
1. Crear cuenta en GitHub
2. Crear nuevo repositorio "rpguitar"
3. Subir todos los archivos del proyecto
4. Ir a Settings > Pages
5. Seleccionar rama "main" como fuente
6. Guardar y esperar 1-2 minutos
7. Tu sitio estará en `https://usuario.github.io/rpguitar`

#### Comando para subir (si usas Git)
```bash
git init
git add .
git commit -m "Sitio inicial RP GUITAR"
git remote add origin https://github.com/usuario/rpguitar.git
git push -u origin main
```

### Opción 2: Netlify (GRATIS)

#### Ventajas
- Hosting gratuito
- Deploy automático
- Dominio personalizado gratis
- SSL automático
- Muy fácil de usar

#### Pasos
1. Ir a https://www.netlify.com
2. Crear cuenta (puede ser con GitHub)
3. Arrastrar carpeta del proyecto a Netlify
4. Netlify genera URL automática
5. (Opcional) Conectar dominio personalizado

### Opción 3: Vercel (GRATIS)

#### Ventajas
- Hosting gratuito
- Muy rápido
- SSL automático
- Dominio personalizado

#### Pasos
1. Ir a https://vercel.com
2. Crear cuenta
3. Importar proyecto
4. Deploy automático

### Opción 4: Hosting Tradicional (PAGO)

#### Proveedores Recomendados en Guatemala
- Hostinger Guatemala
- SiteGround
- BlueHost
- GoDaddy

#### Pasos
1. Contratar hosting + dominio
2. Obtener credenciales FTP
3. Subir archivos vía FTP (FileZilla, Cyberduck)
4. Configurar dominio

#### Estructura de archivos para FTP
Subir todo el contenido a la carpeta `public_html` o `www` del servidor.

## 📁 Archivos a Subir

Asegúrate de incluir TODO:
```
├── index.html
├── menu.js
├── footer.js
├── nav.css
├── nav.html
├── productos.css
├── styles.css
├── README.md
├── CONFIG.md
├── DEPLOY.md
├── PROYECTO-COMPLETADO.md
├── accesorios/
├── amplificadores/
├── bajos/
├── components/
├── guitarras/
├── img/
├── marcas/
├── pedales/
├── rp-music-school/
└── suhr/
```

## 🔒 Configurar HTTPS (SSL)

### GitHub Pages, Netlify, Vercel
SSL viene incluido y activado automáticamente ✅

### Hosting Tradicional
1. Solicitar certificado SSL gratuito (Let's Encrypt)
2. La mayoría de hostings lo ofrecen gratis desde el panel de control
3. Activarlo para tu dominio

## 🌐 Dominio Personalizado

### Opción 1: Comprar Dominio
Proveedores:
- Namecheap (recomendado, económico)
- GoDaddy
- Google Domains
- Proveedor local guatemalteco

### Opción 2: Usar Subdominio Gratis
Servicios como Netlify y Vercel te dan subdominios gratis:
- `rpguitar.netlify.app`
- `rpguitar.vercel.app`

### Conectar Dominio Personalizado

#### En Netlify:
1. Ir a Domain Settings
2. Add custom domain
3. Agregar registros DNS en tu proveedor de dominio:
   - Tipo: A, Host: @, Value: IP de Netlify
   - Tipo: CNAME, Host: www, Value: tu-sitio.netlify.app

#### En GitHub Pages:
1. Crear archivo `CNAME` en raíz con tu dominio
2. Configurar DNS en proveedor de dominio

## ⚙️ Configuraciones Post-Despliegue

### 1. Probar WhatsApp
- Agregar un producto al carrito
- Ir al checkout
- Completar formulario
- Verificar que el mensaje se envía correctamente

### 2. Google Analytics (Opcional)
Agregar al `<head>` de todas las páginas:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=TU-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'TU-ID');
</script>
```

### 3. Google Search Console (SEO)
1. Ir a https://search.google.com/search-console
2. Agregar tu sitio
3. Verificar propiedad
4. Enviar sitemap (si creaste uno)

## 🔧 Mantenimiento

### Actualizar Precios o Productos
1. Editar archivos HTML correspondientes
2. Subir cambios al servidor
3. (Si usas GitHub Pages/Netlify) Push a repositorio

### Actualizar Menú o Footer
1. Editar `menu.js` o `footer.js`
2. Subir cambios
3. Los cambios se aplicarán a todas las páginas automáticamente

## 📱 Pruebas en Móvil

Antes de lanzar, probar en:
- iPhone (Safari)
- Android (Chrome)
- Tablet
- Desktop (Chrome, Firefox, Safari)

Herramientas de prueba:
- Chrome DevTools (F12 > Toggle device toolbar)
- BrowserStack (pruebas en múltiples dispositivos)
- Responsively App (herramienta gratuita)

## ✅ Checklist Final

- [ ] Sitio subido y funcionando
- [ ] SSL (HTTPS) activo
- [ ] WhatsApp funcionando correctamente
- [ ] Navegación funcional en todas las páginas
- [ ] Responsive en móviles
- [ ] Carrito de compras operativo
- [ ] Información de contacto actualizada
- [ ] Redes sociales vinculadas
- [ ] Meta tags para SEO
- [ ] Probado en múltiples dispositivos

## 🆘 Solución de Problemas

### Problema: Las páginas no cargan estilos
**Solución**: Verificar que las rutas de CSS sean correctas (relativas vs absolutas)

### Problema: El menú no aparece
**Solución**: Verificar que `menu.js` está cargando correctamente (revisar consola del navegador F12)

### Problema: WhatsApp no funciona
**Solución**: 
1. Verificar número en `components/cart.js`
2. Asegurarse que tiene el formato correcto: +502XXXXXXXX
3. Probar en móvil real (no emulador)

### Problema: Imágenes no cargan
**Solución**: 
1. Verificar rutas de imágenes
2. Asegurarse que las imágenes existen en la carpeta `img/`
3. Respetar mayúsculas/minúsculas en nombres

## 📞 Siguiente Paso

Una vez desplegado, compartir el enlace con tus clientes:
- Por WhatsApp
- En redes sociales
- En tarjetas de presentación
- En material publicitario

¡Éxito con tu tienda online! 🎸🎵
