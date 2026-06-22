# 📧 Configuración del Formulario de Contacto

Este documento explica cómo configurar el formulario de contacto con **Formspree** o **EmailJS**.

---

## Opción 1: Formspree (Recomendado - Sin Servidor)

### ✅ Ventajas
- Completamente gratuito (hasta 50 emails/mes)
- Sin código de backend
- Interfaz sencilla
- Confirmación de emails en dashboard

### 📋 Pasos de Configuración

#### 1. Crear Cuenta en Formspree
1. Ve a https://formspree.io/
2. Click en "Get Started"
3. Completa el registro con tu email
4. Confirma tu email

#### 2. Crear Nuevo Proyecto
1. En el dashboard, click en "New Project"
2. Nombre: `Forward Vision Landing`
3. Click "Create"

#### 3. Obtener tu Form ID
1. Click en tu proyecto
2. Busca la sección "Integration"
3. Copia el **Form ID** (algo como: `ab12cdef`)

#### 4. Configurar en ContactForm.jsx

**Ubicación:** `src/components/ContactForm.jsx` (línea 63)

**Antes:**
```javascript
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
```

**Después (reemplaza ab12cdef con tu Form ID):**
```javascript
const response = await fetch('https://formspree.io/f/ab12cdef', {
```

#### 5. Prueba
1. Inicia el servidor: `npm run dev`
2. Ve a http://localhost:3000
3. Completa el formulario de contacto
4. Haz clic en "Enviar Mensaje"
5. Deberías recibir un email

### 📊 Dashboard de Formspree
Después de recibir emails, verás:
- ✉️ Lista de mensajes recibidos
- 📈 Estadísticas de formulario
- ✅ Confirmación de entrega
- 🔗 Exportar datos a CSV

---

## Opción 2: EmailJS (Alternativo)

### ✅ Ventajas
- Integración directa con mail providers
- Plantillas de email personalizadas
- Límite más generoso (200 emails/mes gratis)
- Mejor para emails complejos

### 📋 Pasos de Configuración

#### 1. Crear Cuenta en EmailJS
1. Ve a https://www.emailjs.com/
2. Click en "Sign Up Free"
3. Completa el registro
4. Confirma tu email

#### 2. Conectar Proveedor de Email
1. En dashboard, ve a "Email Services"
2. Agrega tu proveedor (Gmail, Outlook, etc.)
3. Sigue las instrucciones de autenticación

#### 3. Crear Plantilla de Email
1. Ve a "Email Templates"
2. Click en "Create Template"
3. Nombre: `contact_form_template`
4. Configura así:

```
Subject: Nuevo mensaje de {{name}}
Body:

De: {{name}}
Email: {{email}}
Teléfono: {{phone}}
Empresa: {{company}}

Mensaje:
{{message}}

---
Enviado desde Forward Vision Landing
```

#### 4. Obtener tus IDs

En el dashboard, necesitas:
- **Service ID** (en "Email Services")
- **Template ID** (en "Email Templates")
- **Public Key** (en "Account > API")

#### 5. Configurar en ContactForm.jsx

Reemplaza líneas 45-57:

```javascript
// Initialize EmailJS (Replace with your Service ID and Public Key)
emailjs.init('YOUR_PUBLIC_KEY') // Reemplaza con tu Public Key

const serviceId = 'service_abc12def' // Tu Service ID
const templateId = 'template_xyz789' // Tu Template ID

const response = await emailjs.send(serviceId, templateId, {
  from_name: formData.name,
  from_email: formData.email,
  phone: formData.phone,
  company: formData.company,
  message: formData.message,
  to_email: 'tu-email@empresa.com', // Tu email de recepción
})
```

---

## Comparativa Formspree vs EmailJS

| Característica | Formspree | EmailJS |
|---|---|---|
| **Configuración** | Muy simple | Intermedia |
| **Emails/mes (gratis)** | 50 | 200 |
| **Plantillas** | Simples | Avanzadas |
| **Backend requerido** | No | No |
| **Curva de aprendizaje** | Muy fácil | Fácil |
| **Mejor para** | Empezar | Producción |

**Recomendación:** Usa **Formspree** para empezar, luego migra a **EmailJS** si necesitas más emails.

---

## Validación del Formulario

El formulario incluye validaciones automáticas:

```javascript
// Validaciones incluidas
✓ Nombre: requerido, mínimo 1 carácter
✓ Email: requerido, formato válido
✓ Teléfono: opcional, formato (+34 91 123 4567)
✓ Empresa: opcional
✓ Mensaje: requerido, mínimo 10 caracteres
```

Ejemplo de validación:
```javascript
if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
  setErrorMessage('Email inválido')
  return
}
```

---

## Estados del Formulario

El componente maneja 4 estados:

```javascript
null        // Estado inicial (botón normal)
'sending'   // Enviando (botón deshabilitado + spinner)
'success'   // Éxito (mensaje verde, limpia form)
'error'     // Error (mensaje rojo + detalles)
```

### Visual de Estados

```
ESTADO INICIAL
┌─────────────────────┐
│  Enviar Mensaje ✈️  │
└─────────────────────┘

ENVIANDO
┌─────────────────────┐
│  ⏳ Enviando...      │
└─────────────────────┘
(botón deshabilitado)

ÉXITO ✓
┌─────────────────────────────────────┐
│  ✓ ¡Mensaje enviado correctamente!  │
│    Nos pondremos en contacto pronto │
└─────────────────────────────────────┘

ERROR ❌
┌─────────────────────────────────────┐
│  El email no es válido              │
│  (se limpia después de 5 segundos)  │
└─────────────────────────────────────┘
```

---

## Troubleshooting

### ❌ "CORS Error"
**Problema:** Error de Cross-Origin

**Solución con Formspree:**
- Formspree maneja CORS automáticamente ✅
- No necesitas configuración adicional

**Solución con EmailJS:**
- EmailJS también maneja CORS ✅
- Verifica que tu dominio esté autorizado

### ❌ "Email no llega"
1. Verifica spam/carpeta de spam
2. Confirma que configuraste el Form ID correctamente
3. En Formspree, confirma el email de recepción
4. Prueba desde incógnito (sin cache)

### ❌ "Formulario no valida"
Revisa `validateForm()` en ContactForm.jsx:
```javascript
const validateForm = () => {
  const errors = []
  // Agrega más validaciones aquí si necesitas
  return errors
}
```

### ❌ "Botón no responde"
- Verifica que `handleSubmit` está vinculado: `onSubmit={handleSubmit}`
- Asegúrate que `type="submit"` en el botón
- Comprueba en la consola (F12) si hay errores

---

## Personalización de Mensajes

### Mensajes de Error
En `ContactForm.jsx`, línea 34:

```javascript
if (errors.length > 0) {
  setErrorMessage(errors[0])  // Personaliza aquí
  return
}
```

Cambiar mensaje:
```javascript
if (!formData.name.trim()) {
  errors.push('Por favor, ingresa tu nombre completo')  // ← Tu mensaje
}
```

### Mensaje de Éxito
En `ContactForm.jsx`, línea 76:

```javascript
setStatus('success')
setFormData({...})  // Limpia form automáticamente

// Personaliza el mensaje en el JSX (línea 216)
¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.
```

---

## Avanzado: Enviar a Múltiples Emails

### Con Formspree
1. En settings de Formspree, agrega emails múltiples
2. Se enviarán automáticamente a todos

### Con EmailJS
Modifica la plantilla:
```
To: {{to_email_1}}, {{to_email_2}}
```

O en el código:
```javascript
const bccList = [
  'admin@empresa.com',
  'ventas@empresa.com'
]

for (let email of bccList) {
  await emailjs.send(serviceId, templateId, {
    ...formData,
    to_email: email
  })
}
```

---

## Logging y Debugging

Para ver qué pasa en el formulario, usa console.log:

```javascript
const handleSubmit = async (e) => {
  console.log('Form data:', formData)  // Ver datos
  console.log('Validating...')
  
  try {
    const response = await fetch(...)
    console.log('Response:', response)  // Ver respuesta
  } catch (error) {
    console.error('Error:', error)  // Ver error
  }
}
```

Abre F12 en el navegador para ver los logs.

---

## Checklist Pre-Producción

- [ ] ✅ Form ID configurado correctamente
- [ ] ✅ Email de confirmación recibido desde Formspree
- [ ] ✅ Probaste el formulario completamente
- [ ] ✅ Estados visuales funcionan (enviando, éxito, error)
- [ ] ✅ Validaciones funcionan
- [ ] [ ✅ Emails llegan a tu bandeja
- [ ] ✅ Mensaje de éxito es clara

---

## Support

Documentación oficial:
- **Formspree:** https://formspree.io/documentation
- **EmailJS:** https://www.emailjs.com/docs/

**¡Tu formulario está listo para recibir consultas! 📧**
