# 🏗️ Arquitectura y Flujo de Componentes

## Diagrama General

```
┌─────────────────────────────────────────────────────┐
│                    App.jsx                          │
│              (Orquestador Principal)                │
└─────────────────────────────────────────────────────┘
         │              │              │
         ▼              ▼              ▼
    ┌────────┐    ┌─────────┐    ┌──────────┐
    │ Navbar │    │ Hero    │    │ Services │
    └────────┘    └─────────┘    └──────────┘
         │              │              │
    (Fixed Top)    (Full Height)   (Grid 3x2)
    
         │              │              │
         ▼              ▼              ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │ Contact  │   │ Chatbot  │   │ Footer   │
    │   Form   │   │ Widget   │   │          │
    └──────────┘   └──────────┘   └──────────┘
         │              │              │
    (Form +Data)   (Flotante)    (Bottom)
```

---

## Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                  App.jsx (Estado Global)                    │
│  - Orquesta todos los componentes                           │
│  - Maneja contexto de scroll                               │
│  - Proporciona funciones de navegación                     │
└─────────────────────────────────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
         ▼                ▼                ▼
    ┌─────────┐      ┌─────────┐     ┌──────────┐
    │ Navbar  │      │  Hero   │     │ Services │
    │ - State │      │ - State │     │ - State  │
    │ isOpen  │      │ -Anim   │     │hovered   │
    │isScrolled       │-Scroll  │     │Index     │
    └─────────┘      │ Detector│     └──────────┘
         │           └─────────┘            │
         │                │                 │
         └────────────────┼─────────────────┘
                          │
              Envía eventos a secciones
              (scrollToSection)
                          │
         ┌────────────────┼────────────────┐
         │                │                │
         ▼                ▼                ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ Contact  │    │ Chatbot  │    │ Footer   │
    │ FormData │    │ Messages │    │ Links    │
    │Validation│    │ isOpen   │    │ Social   │
    │ Status   │    │ onChange │    │ Copyright
    └──────────┘    └──────────┘    └──────────┘
```

---

## Componente: App.jsx

```
App.jsx
├─ Framer Motion Container
│  └─ Global opacity animation
│
├─ useEffect Hook
│  └─ Configura smooth scroll
│
├─ Return JSX
│  ├─ Navbar (fixed)
│  │  └─ Navbar.jsx
│  │
│  ├─ Main Content
│  │  ├─ Hero Section (#hero)
│  │  │  └─ Hero.jsx
│  │  │
│  │  ├─ Services Section (#services)
│  │  │  └─ Services.jsx
│  │  │
│  │  └─ Contact Section (#contact)
│  │     └─ ContactForm.jsx
│  │
│  ├─ ChatbotWidget (fixed bottom-right)
│  │  └─ ChatbotWidget.jsx
│  │
│  ├─ Footer
│  │  └─ Footer.jsx
│  │
│  └─ Decorative Background Elements
│     └─ Blobs animados
```

---

## Componente: Navbar.jsx

```
Navbar Component
│
├─ State
│  ├─ isOpen (menú móvil)
│  └─ isScrolled (scroll detection)
│
├─ useEffect
│  └─ Event listener: window.scroll
│     └─ Actualiza isScrolled
│
├─ Functions
│  ├─ toggleMenu()
│  │  └─ Cambia isOpen
│  │
│  └─ scrollToSection(id)
│     └─ Scroll suave a sección
│
└─ Render
   ├─ Logo + Brand Name
   ├─ Desktop Menu
   │  ├─ Inicio
   │  ├─ Servicios
   │  ├─ Contacto
   │  └─ CTA Button
   │
   ├─ Mobile Menu Button
   │  └─ Hamburger/X icon
   │
   └─ Mobile Menu (conditional)
      └─ Animated dropdown
```

---

## Componente: Hero.jsx

```
Hero Section
│
├─ Animation Variants (Framer Motion)
│  ├─ containerVariants
│  │  └─ staggerChildren: 0.2
│  │
│  └─ itemVariants
│     └─ fadeInUp animation
│
├─ State
│  └─ (No usa state local)
│
├─ Functions
│  └─ scrollToSection(id)
│
└─ Render
   ├─ Background Decorative Elements
   │  ├─ Animated Blob 1
   │  └─ Animated Blob 2
   │
   ├─ Content Grid (md:grid-cols-2)
   │  ├─ Left Side
   │  │  ├─ Badge "Innovación Tecnológica"
   │  │  ├─ Title + Gradient Text
   │  │  ├─ Description
   │  │  ├─ Buttons (CTA)
   │  │  └─ Stats Grid (3 columns)
   │  │
   │  └─ Right Side (Hidden en móvil)
   │     └─ 3D-like Visual Box
   │
   └─ Scroll Indicator (animated)
```

---

## Componente: Services.jsx

```
Services Grid Component
│
├─ State
│  └─ hoveredIndex (índice de tarjeta en hover)
│
├─ Data
│  └─ services[] (array de 6 servicios)
│     ├─ icon (Lucide icon)
│     ├─ title
│     ├─ description
│     └─ color (gradient)
│
├─ Render
│  ├─ Header Section
│  │  ├─ Badge "Nuestros Servicios"
│  │  ├─ Title
│  │  └─ Description
│  │
│  ├─ Grid (lg:grid-cols-3)
│  │  └─ 6 Service Cards
│  │     ├─ Icon Container (animated)
│  │     ├─ Title
│  │     ├─ Description
│  │     ├─ CTA Link
│  │     │  └─ "Explorar"
│  │     │
│  │     └─ Hover Effects
│  │        ├─ Scale on hover
│  │        ├─ Rotate icon
│  │        └─ Arrow animation
│  │
│  └─ CTA Section
│     └─ "Consulta Gratuita" Button
```

---

## Componente: ContactForm.jsx

```
Contact Form Component
│
├─ State
│  ├─ formData {}
│  │  ├─ name
│  │  ├─ email
│  │  ├─ phone
│  │  ├─ company
│  │  └─ message
│  │
│  ├─ status (null | 'sending' | 'success' | 'error')
│  └─ errorMessage
│
├─ Functions
│  ├─ validateForm()
│  │  └─ Valida todos los campos
│  │
│  ├─ handleChange(e)
│  │  └─ Actualiza formData
│  │
│  └─ handleSubmit(e)
│     ├─ Valida
│     ├─ Envía a Formspree/EmailJS
│     ├─ Actualiza status
│     └─ Reset on success
│
└─ Render
   ├─ Header
   │  ├─ Badge
   │  ├─ Title
   │  └─ Description
   │
   ├─ Contact Info Cards (3 cols)
   │  ├─ Email
   │  ├─ Phone
   │  └─ Location
   │
   ├─ Form Container
   │  ├─ Name Input
   │  │  └─ text
   │  │
   │  ├─ Email Input
   │  │  └─ email
   │  │
   │  ├─ Phone & Company Grid
   │  │  ├─ Phone Input (tel)
   │  │  └─ Company Input (text)
   │  │
   │  ├─ Message Textarea
   │  │  └─ 5 rows
   │  │
   │  ├─ Status Messages
   │  │  ├─ Error (red)
   │  │  ├─ Sending (blue spinner)
   │  │  └─ Success (green)
   │  │
   │  ├─ Submit Button
   │  │  ├─ Normal: "Enviar Mensaje"
   │  │  └─ Sending: "⏳ Enviando..."
   │  │
   │  └─ Disclaimer
   │     └─ Política de privacidad
   │
   └─ Chatbot Widget Placeholder
```

---

## Componente: ChatbotWidget.jsx

```
Chatbot Widget Component
│
├─ State
│  ├─ isOpen (widget abierto/cerrado)
│  └─ messages[]
│     └─ {id, text, sender, timestamp}
│
├─ Functions
│  └─ handleSendMessage()
│     ├─ Crea user message
│     ├─ Simula bot response (setTimeout)
│     └─ Limpia input
│
└─ Render
   ├─ Floating Button (Fixed)
   │  ├─ Position: bottom-6 right-6
   │  ├─ Gradient background
   │  └─ Icon: MessageCircle | X
   │
   └─ Chat Widget (AnimatePresence)
      ├─ Header
      │  ├─ Title
      │  ├─ Status message
      │  └─ Minimize button
      │
      ├─ Messages Container (scrollable)
      │  └─ Message Bubbles
      │     ├─ User (right, blue)
      │     └─ Bot (left, white)
      │
      └─ Input Section
         ├─ Input field
         └─ Send button
```

---

## Componente: Footer.jsx

```
Footer Component
│
├─ Data
│  ├─ currentYear
│  ├─ socialLinks[]
│  │  └─ {icon, label, href}
│  │
│  └─ footerLinks[]
│     ├─ Empresa
│     ├─ Legal
│     └─ Soporte
│
└─ Render
   ├─ Main Footer Content
   │  ├─ Brand Section
   │  │  ├─ Logo + Name
   │  │  ├─ Description
   │  │  └─ Social Icons
   │  │
   │  ├─ Link Sections (3)
   │  │  └─ Empresa
   │  │  └─ Legal
   │  │  └─ Soporte
   │  │
   │  └─ Contact Info
   │     ├─ Email
   │     ├─ Phone
   │     └─ Location
   │
   └─ Bottom Section
      ├─ Divider
      ├─ Copyright
      └─ Credits
```

---

## Flujo de Navegación

```
Usuario hace scroll
       │
       ▼
Navbar detecta (window.scrollY > 50)
       │
       ▼
isScrolled = true
       │
       ▼
Navbar cambia de estilo
(bg-white shadow-lg)
       │
       ▼
Usuario llega a sección #services
       │
       ▼
Framer Motion dispara whileInView
       │
       ▼
Elementos animan entrada
```

---

## Flujo de Formulario

```
Usuario completa formulario
       │
       ▼
Click "Enviar Mensaje"
       │
       ▼
handleSubmit() trigger
       │
       ▼
validateForm() 
   ├─ Si error → muestra mensaje
   └─ Si OK → continúa
       │
       ▼
setStatus('sending')
       │
       ▼
fetch a Formspree
       │
       ├─ Éxito → setStatus('success')
       │          → limpia form
       │          → muestra mensaje verde
       │          → reset después 5s
       │
       └─ Error → setStatus('error')
                  → muestra mensaje rojo
                  → reset después 5s
```

---

## Flujo de Animaciones

```
Página carga
   │
   ▼
App.jsx inicial={{opacity: 0}}
   │
   ▼
animate={{opacity: 1}} (0.5s)
   │
   ▼
Hero aparece con fade-in up
   │
   ▼
Usuario scrollea
   │
   ▼
whileInView dispara en cada sección
   │
   ▼
Componentes animan entrada
```

---

## Convención de Archivos

```
src/
├─ components/          (Componentes reutilizables)
│  ├─ *.jsx            (Siempre PascalCase)
│  └─ export default   (Named export por defecto)
│
├─ pages/              (Páginas futuras)
│  └─ *.jsx
│
├─ App.jsx            (Orquestador)
├─ main.jsx           (Entrada)
└─ index.css          (Estilos globales)
```

---

## Props vs State

| Componente | State | Props |
|---|---|---|
| **Navbar** | isOpen, isScrolled | ninguno |
| **Hero** | ninguno | ninguno |
| **Services** | hoveredIndex | ninguno |
| **ContactForm** | formData, status, errorMessage | ninguno |
| **ChatbotWidget** | isOpen, messages | ninguno |
| **Footer** | ninguno | ninguno |

---

## Performance Considerations

```
✅ Lazy animation start (delay)
✅ Memoización en listas
✅ useEffect cleanup
✅ Event listener cleanup
✅ No re-renders innecesarios
✅ CSS en lugar de JS donde sea posible
✅ IntersectionObserver (whileInView)
```

---

## SEO Structure

```
<html>
  <head>
    <title>Forward Vision - Innovación Tecnológica</title>
    <meta name="description" content="...">
  </head>
  <body>
    <nav> <!-- Navbar -->
    <main>
      <section id="hero"> <!-- Hero -->
      <section id="services"> <!-- Services -->
      <section id="contact"> <!-- ContactForm -->
    </main>
    <footer> <!-- Footer -->
  </body>
</html>
```

---

**¡Entiendes ahora la arquitectura completa! 🏗️**
