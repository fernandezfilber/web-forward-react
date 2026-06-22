# 💡 Tips, Mejores Prácticas y Ejemplos de Personalización

## 🎨 Cambios de Estilo Comunes

### 1. Cambiar la Paleta de Colores Completa

**En `tailwind.config.js`:**

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#fff7ed',
        600: '#ea580c',    // Cambiar de azul a naranja
        800: '#c2410c',
        950: '#7c2d12',
      },
      secondary: {
        900: '#1a1a2e',    // Cambiar gris
      },
    },
  },
},
```

**Resultado:** Toda la app usa los nuevos colores automáticamente.

---

### 2. Cambiar Tipografía (Font)

**En `index.html`:**

```html
<!-- Agregar Google Font -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
```

**En `tailwind.config.js`:**

```javascript
theme: {
  extend: {
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],  // Cambiar font global
    },
  },
},
```

---

### 3. Agregar Logo Imagen

**Reemplazar en `Navbar.jsx`:**

```javascript
// Antes (logo texto)
<div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg">
  <span className="text-white font-bold">FV</span>
</div>

// Después (logo imagen)
<img src="/logo.png" alt="Forward Vision" className="w-8 h-8" />
```

**Coloca tu logo en `public/logo.png`**

---

## 🎬 Personalizar Animaciones

### 1. Cambiar Velocidad de Animaciones

**En componente (ejemplo Hero.jsx):**

```javascript
// Más rápido (0.3s)
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3 }}

// Más lento (1s)
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 1 }}
```

### 2. Cambiar Tipo de Easing

```javascript
// ease-in (comienza lento)
transition={{ duration: 0.6, ease: 'easeIn' }}

// ease-out (termina lento)
transition={{ duration: 0.6, ease: 'easeOut' }}

// ease-in-out (ambos lados)
transition={{ duration: 0.6, ease: 'easeInOut' }}

// lineal (velocidad constante)
transition={{ duration: 0.6, ease: 'linear' }}
```

### 3. Agregar Rotación en Hover

```javascript
// En Services.jsx, agrega a las tarjetas
<motion.div
  whileHover={{ 
    scale: 1.05,
    rotate: 5,  // ← Gira 5 grados
  }}
>
  Tarjeta de Servicio
</motion.div>
```

---

## 📝 Personalizar Contenido de Secciones

### 1. Cambiar Números de Stats (Hero.jsx)

```javascript
// Línea ~95 en Hero.jsx
{[
  { number: '500+', label: 'Proyectos' },        // ← Cambiar
  { number: '95%', label: 'Satisfacción' },      // ← Cambiar
  { number: '10+', label: 'Años' },              // ← Cambiar
]}
```

### 2. Agregar Más Servicios

```javascript
// En Services.jsx, agrega a array
const services = [
  // ... servicios existentes ...
  {
    icon: Database,  // Importar: import { Database } from 'lucide-react'
    title: 'Base de Datos',
    description: 'Gestión optimizada de datos con escalabilidad.',
    color: 'from-indigo-600 to-indigo-800',
  },
]
```

### 3. Cambiar Textos de Contacto

```javascript
// En ContactForm.jsx, línea ~200
<h2>Cuéntanos tu Proyecto</h2>  // ← Cambiar título

// Línea ~210
<p>Estamos listos para...</p>    // ← Cambiar descripción

// Línea ~235
<button>Enviar Mensaje</button>  // ← Cambiar label botón
```

---

## 🔗 Integrar Enlaces Reales

### 1. Cambiar Links de Social Media

**En `Footer.jsx`:**

```javascript
const socialLinks = [
  { 
    icon: Linkedin, 
    label: 'LinkedIn', 
    href: 'https://linkedin.com/company/tu-empresa'  // ← Cambiar
  },
  { 
    icon: Twitter, 
    label: 'Twitter', 
    href: 'https://twitter.com/tu-empresa'  // ← Cambiar
  },
]
```

### 2. Cambiar Links del Footer

**En `Footer.jsx`:**

```javascript
const footerLinks = [
  {
    title: 'Empresa',
    links: [
      { label: 'Blog', href: '/blog' },      // ← Agregar
      { label: 'Carrera', href: '/careers' }, // ← Agregar
    ],
  },
]
```

---

## 🎯 Agregar Nuevas Secciones

### Estructura de Nueva Sección

```javascript
// src/components/NewSection.jsx
import React from 'react'
import { motion } from 'framer-motion'

export default function NewSection() {
  return (
    <section id="new-section" className="py-20 md:py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Tu Nueva Sección</h2>
          {/* Contenido aquí */}
        </motion.div>
      </div>
    </section>
  )
}
```

### Integrar en App.jsx

```javascript
import NewSection from './components/NewSection'

function App() {
  return (
    <main>
      <Hero />
      <Services />
      <NewSection />  {/* ← Agregar aquí */}
      <ContactForm />
    </main>
  )
}
```

---

## 🔄 Agregar Carrusel de Clientes

```javascript
// src/components/Clients.jsx
import { motion } from 'framer-motion'

export default function Clients() {
  const clients = [
    { name: 'Empresa A', logo: '/logo-a.png' },
    { name: 'Empresa B', logo: '/logo-b.png' },
    // ...
  ]

  return (
    <section className="py-20">
      <motion.div className="flex gap-8 overflow-x-auto">
        {clients.map((client) => (
          <motion.div
            key={client.name}
            whileHover={{ scale: 1.1 }}
            className="flex-shrink-0"
          >
            <img src={client.logo} alt={client.name} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
```

---

## 📊 Agregar Testimonios

```javascript
// src/components/Testimonials.jsx
const testimonials = [
  {
    name: 'Juan García',
    role: 'CEO de TechCorp',
    text: 'Forward Vision transformó completamente nuestro proyecto.',
    image: '/avatar1.jpg',
    rating: 5,
  },
  // ...
]

export default function Testimonials() {
  return (
    <section className="py-20">
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <motion.div
            key={testimonial.name}
            className="bg-white rounded-lg p-6 border"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-gray-700">{testimonial.text}</p>
            <div className="flex gap-1 mt-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <span key={i}>⭐</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
```

---

## 🎬 Agregar Video en Hero

```javascript
// En Hero.jsx, reemplazar lado derecho

<div className="hidden md:flex items-center justify-center">
  <motion.video
    className="w-full max-w-md rounded-2xl"
    autoPlay
    muted
    loop
    src="/demo-video.mp4"
  />
</div>
```

---

## 🌍 Agregar Soporte Multi-idioma

```javascript
// src/i18n/translations.js
export const translations = {
  es: {
    hero: {
      title: 'El Futuro de tu Negocio',
      description: 'Soluciones tecnológicas innovadoras...',
    },
  },
  en: {
    hero: {
      title: 'The Future of Your Business',
      description: 'Innovative technology solutions...',
    },
  },
}

// En componentes
import { useLanguage } from '../hooks/useLanguage'

export default function Hero() {
  const { language } = useLanguage()
  const t = translations[language]

  return <h1>{t.hero.title}</h1>
}
```

---

## 🔐 Proteger Ruta de Contacto

```javascript
// Agregar rate limiting simple
let messageCount = 0
const resetCount = () => messageCount = 0

const handleSubmit = async (e) => {
  if (messageCount >= 3) {
    setErrorMessage('Has alcanzado el límite de mensajes')
    return
  }
  
  messageCount++
  setTimeout(resetCount, 3600000) // Reset cada hora
  
  // ... resto del código
}
```

---

## 📈 Agregar Analytics

### Con Google Analytics

```javascript
// En main.jsx, importar al principio
import ReactGA from 'react-ga4'

ReactGA.initialize('G-YOUR_GA_ID')

// Track page view
ReactGA.send({ hitType: 'pageview', page: '/', title: 'Home' })

// Track evento de formulario
const handleSubmit = async (e) => {
  ReactGA.event({
    category: 'form',
    action: 'submit',
    label: 'contact_form',
  })
  // ... resto
}
```

---

## 🎨 Agregar Tema Oscuro

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // Habilitar tema oscuro

// En App.jsx
const [darkMode, setDarkMode] = useState(false)

return (
  <div className={darkMode ? 'dark' : ''}>
    {/* Contenido */}
  </div>
)

// En estilos
<button
  className="bg-white dark:bg-gray-900 text-black dark:text-white"
>
```

---

## 🔍 Mejora SEO

### Agregar sitemap.xml

```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://forwardvision.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

### Agregar robots.txt

```txt
<!-- public/robots.txt -->
User-agent: *
Allow: /
Disallow: /admin

Sitemap: https://forwardvision.com/sitemap.xml
```

---

## ⚡ Optimizaciones de Rendimiento

### Lazy Loading de Componentes

```javascript
// En App.jsx
import { lazy, Suspense } from 'react'

const Services = lazy(() => import('./components/Services'))
const ContactForm = lazy(() => import('./components/ContactForm'))

function App() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Services />
      <ContactForm />
    </Suspense>
  )
}
```

### Optimizar Imágenes

```javascript
// Usar WebP con fallback
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" />
</picture>
```

---

## 🚀 Deploy Checklist

- [ ] ✅ Reemplazar `YOUR_FORM_ID` en ContactForm.jsx
- [ ] ✅ Actualizar meta tags en index.html
- [ ] ✅ Configurar dominio personalizado
- [ ] ✅ Habilitar HTTPS
- [ ] ✅ Configurar CORS si es necesario
- [ ] ✅ Agregar favicon
- [ ] ✅ Revisar performance (Lighthouse)
- [ ] ✅ Test en dispositivos reales
- [ ] ✅ Configurar analytics
- [ ] ✅ Hacer backup del código

---

## 📱 Testing Responsive

Prueba en:
- 📱 iPhone SE (375px)
- 📱 iPhone 12 (390px)
- 📱 iPad Mini (768px)
- 💻 Laptop (1920px)

```bash
# Simular dispositivo en Chrome DevTools
F12 → Ctrl+Shift+M
```

---

**¡Ahora tienes todas las herramientas para personalizar tu landing page! 🎉**
