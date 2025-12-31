# Configuración de Correo Electrónico

Para que funcione el envío de correos electrónicos en el cierre de caja, necesitas configurar las credenciales SMTP en:

**Archivo:** `app/api/ventas/cierre/route.js`

## Opción 1: Usar Gmail

1. Ve a tu cuenta de Gmail
2. Habilita la verificación en dos pasos
3. Genera una "Contraseña de aplicación":
   - Ve a: https://myaccount.google.com/apppasswords
   - Selecciona "Correo" y "Otro (nombre personalizado)"
   - Copia la contraseña generada (16 caracteres)

4. En el archivo `route.js`, reemplaza:
```javascript
auth: {
  user: 'tu_email@gmail.com', // Tu correo de Gmail
  pass: 'xxxx xxxx xxxx xxxx' // La contraseña de aplicación de 16 caracteres
}
```

## Opción 2: Usar otro proveedor SMTP

Configura según tu proveedor:

### SendGrid:
```javascript
host: 'smtp.sendgrid.net',
port: 587,
auth: {
  user: 'apikey',
  pass: 'TU_API_KEY_DE_SENDGRID'
}
```

### Outlook/Hotmail:
```javascript
host: 'smtp.office365.com',
port: 587,
auth: {
  user: 'tu_email@outlook.com',
  pass: 'tu_contraseña'
}
```

## Correo de destino

El correo se envía actualmente a: **ffervidal74@gmail.com**

Para cambiar el destinatario, modifica la línea:
```javascript
to: 'nuevo_correo@ejemplo.com',
```

## Formato del reporte

El correo incluye:
- 📊 Resumen con totales (General, Efectivo, Tarjeta)
- 📝 Tabla detallada con todas las ventas del día
- 🎨 Diseño HTML profesional con colores corporativos
- 📅 Fecha y hora del cierre de caja

## Prueba

1. Configura las credenciales
2. Accede con código 0001
3. Registra algunas ventas
4. Haz clic en "Cierre de Caja"
5. Verifica que llegue el correo a ffervidal74@gmail.com
