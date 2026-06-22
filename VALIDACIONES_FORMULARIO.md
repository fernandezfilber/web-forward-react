# 🔍 Validaciones del Formulario de Contacto

## Tabla de Validaciones

| Campo | Validación | Mensaje de Error | Requerido |
|---|---|---|---|
| **Nombre** | Mínimo 1 carácter | "El nombre es requerido" | ✅ Sí |
| **Email** | Formato válido (user@domain.ext) | "El email no es válido" | ✅ Sí |
| **Teléfono** | Opcional, si aplica formato: +34 91 1234567 | "El teléfono no es válido" | ❌ No |
| **Empresa** | Cualquier texto | N/A | ❌ No |
| **Mensaje** | Mínimo 10 caracteres | "El mensaje debe tener al menos 10 caracteres" | ✅ Sí |

---

## Ejemplos de Validación

### ✅ Formulario Válido
```
Nombre: Juan García López
Email: juan@empresa.com
Teléfono: +34 91 234 5678
Empresa: TechCorp S.L.
Mensaje: Hola, me gustaría conocer más sobre sus servicios de desarrollo web.
```
**Resultado:** Envía correctamente ✅

### ❌ Formulario Inválido - Ejemplo 1
```
Nombre: [vacío]
Email: juan@empresa.com
```
**Resultado:** Error - "El nombre es requerido" ❌

### ❌ Formulario Inválido - Ejemplo 2
```
Nombre: Juan García
Email: juan[INCORRECTO].com
Mensaje: Hola
```
**Resultado:** Error - "El email no es válido" ❌

### ❌ Formulario Inválido - Ejemplo 3
```
Nombre: Juan García
Email: juan@empresa.com
Mensaje: Hola
```
**Resultado:** Error - "El mensaje debe tener al menos 10 caracteres" ❌

---

## Patrón de Email

```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Válidos:
✅ user@domain.com
✅ contact@empresa.co.uk
✅ info+tag@website.org

// Inválidos:
❌ user@domain       (sin .com)
❌ @domain.com       (sin usuario)
❌ user@.com         (sin dominio)
❌ user domain@com   (espacios)
```

---

## Patrón de Teléfono

```javascript
const phoneRegex = /^[\d\s\-\+\(\)]{5,}$/

// Válidos (mínimo 5 caracteres):
✅ +34 91 234 5678
✅ 91-234-5678
✅ (91) 234-5678
✅ 912345678

// Inválidos:
❌ 123           (menos de 5 caracteres)
❌ abc123        (caracteres inválidos)
```

---

## Flujo de Validación

```
Usuario completa formulario
         │
         ▼
Click "Enviar Mensaje"
         │
         ▼
handleSubmit() dispara
         │
         ▼
validateForm() se ejecuta
         │
    ┌────┴────┐
    │          │
    ▼          ▼
VÁLIDO      INVÁLIDO
    │          │
    ▼          ▼
Envía       Muestra error
   │            │
   ▼            ▼
Formspree   errorMessage
   │            │
   ▼            ▼
Respuesta   Se limpia en 5s
   │
   ├─ 200 → Success ✅
   │
   └─ Error → Error ❌
```

---

## Estados Visuales del Formulario

### Estado 1: Normal (Inicial)
```
┌─────────────────────────────────────┐
│ Nombre Completo *                   │
│ [_________________________]          │
│                                     │
│ Email *                             │
│ [_________________________]          │
│                                     │
│ Teléfono                            │
│ [_________________________]          │
│                                     │
│ Empresa                             │
│ [_________________________]          │
│                                     │
│ Mensaje *                           │
│ [________________________            │
│  ________________________]           │
│                                     │
│ [  Enviar Mensaje  ✉️  ]            │
└─────────────────────────────────────┘
```

### Estado 2: Error
```
┌─────────────────────────────────────┐
│ ⚠️  El email no es válido            │
│    (fondo rojo suave)               │
│                                     │
│ [Formulario con campos vacíos]      │
│                                     │
│ [  Enviar Mensaje  ✉️  ]            │
│                                     │
│ (El error se limpia en 5 segundos)  │
└─────────────────────────────────────┘
```

### Estado 3: Enviando
```
┌─────────────────────────────────────┐
│ ⏳ Enviando tu mensaje...             │
│    (fondo azul suave)               │
│                                     │
│ [Todos los campos deshabilitados]   │
│ [Botón deshabilitado]               │
│                                     │
│ [  ⏳ Enviando...  ]                 │
│    (no clickeable)                  │
└─────────────────────────────────────┘
```

### Estado 4: Éxito
```
┌─────────────────────────────────────┐
│ ✓ ¡Mensaje enviado correctamente!   │
│   Nos pondremos en contacto pronto.  │
│   (fondo verde suave)               │
│                                     │
│ [Formulario se limpió automático]   │
│                                     │
│ [  Enviar Mensaje  ✉️  ]            │
│ (vuelve a normal después)           │
└─────────────────────────────────────┘
```

---

## Desactivación de Campos

Cuando el estado es "enviando", todos los campos quedan deshabilitados:

```javascript
disabled={status === 'sending'}
```

Esto significa:
- ❌ No se puede escribir
- ❌ No se puede hacer click
- ✅ Pero se ve visualmente deshabilitado
- ✅ El usuario sabe que está procesando

---

## Reset Automático del Formulario

### Al Enviar Exitosamente
```javascript
setFormData({
  name: '',
  email: '',
  phone: '',
  company: '',
  message: '',
})
```

### Limpie en 5 Segundos
```javascript
setTimeout(() => {
  setStatus(null)
}, 5000)
```

---

## Pruebas Recomendadas

### Test 1: Solo Nombre (Falta Email)
```
Nombre: Juan
Email: [vacío]
Mensaje: Este es un mensaje de prueba válido
```
**Esperado:** Error "El email es requerido" ❌

### Test 2: Email Inválido
```
Nombre: Juan
Email: juanempresa.com    ← Falta @
Mensaje: Este es un mensaje de prueba válido
```
**Esperado:** Error "El email no es válido" ❌

### Test 3: Mensaje Muy Corto
```
Nombre: Juan
Email: juan@empresa.com
Mensaje: Hola   ← Solo 4 caracteres
```
**Esperado:** Error "El mensaje debe tener al menos 10 caracteres" ❌

### Test 4: Todo Válido
```
Nombre: Juan García
Email: juan@empresa.com
Teléfono: +34 91 234 5678
Empresa: TechCorp
Mensaje: Hola, me gustaría conocer más sobre sus servicios de desarrollo web.
```
**Esperado:** Se envía ✅ → Muestra éxito ✅ → Se limpia en 5s ✅

---

## Personalizar Mensajes de Error

En `src/components/ContactForm.jsx`, función `validateForm()`:

```javascript
const validateForm = () => {
  const errors = []

  if (!formData.name.trim()) {
    errors.push('Por favor, completa tu nombre')  // ← Cambiar mensaje
  }

  if (!formData.email.trim()) {
    errors.push('Tu email es necesario para contactarte')  // ← Cambiar
  } else if (!emailRegex.test(formData.email)) {
    errors.push('Verifica que hayas escrito bien tu email')  // ← Cambiar
  }

  if (formData.phone && !/^[\d\s\-\+\(\)]{5,}$/.test(formData.phone)) {
    errors.push('Formato de teléfono: +34 91 234 5678')  // ← Cambiar
  }

  if (!formData.message.trim()) {
    errors.push('Cuéntanos sobre tu proyecto')  // ← Cambiar
  } else if (formData.message.trim().length < 10) {
    errors.push('Necesitamos más detalles (mínimo 10 caracteres)')  // ← Cambiar
  }

  return errors
}
```

---

## Debugging

Para ver qué está pasando, abre la consola (F12) y busca:

```javascript
// Agrega en handleSubmit()
console.log('Form data:', formData)
console.log('Validation errors:', errors)
console.log('Status:', status)
console.log('Error message:', errorMessage)
```

Luego en el navegador:
1. Presiona F12
2. Ve a la pestaña "Console"
3. Completa el formulario
4. Haz click en "Enviar"
5. Mira los logs

---

## Casos Edge (Casos Especiales)

### Espacio en Blanco
```javascript
// Si escribes solo espacios
"   "

// .trim() lo convierte a:
""

// Resultado: Validación falla ✅ (correcto)
```

### Email con Punto Doble
```javascript
// juan..garcia@empresa.com

// Técnicamente válido por el regex
// Pero Formspree lo rechaza
// → Error del servidor (manejado) ✅
```

### Teléfono con Caracteres Especiales
```javascript
// +34 (91) 234-5678

// Regex permite: \d \s \- \+ \( \)
// Resultado: Válido ✅
```

---

## Integración con Formspree

El formulario envía así:

```javascript
const response = await fetch('https://formspree.io/f/ab12cdef', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData),
})

// Formspree recibe:
{
  "name": "Juan García",
  "email": "juan@empresa.com",
  "phone": "+34 91 234 5678",
  "company": "TechCorp",
  "message": "Mensaje aquí..."
}
```

---

## Troubleshooting Validación

### ❌ "Validación no funciona"
1. Verifica que `validateForm()` está definida
2. Verifica que `setErrorMessage()` está en estado
3. Abre F12 console para ver errores

### ❌ "Error no se limpia"
```javascript
// Verifica que hay timeout:
setTimeout(() => {
  setStatus(null)
  setErrorMessage('')
}, 5000)
```

### ❌ "Campos siguen deshabilitados"
Verifica que el estado vuelve a `null`:
```javascript
setStatus(null)  // ← Tiene que estar aquí
```

---

**¡Tus validaciones están listas y funcionando! ✅**
