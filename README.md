# Forward Vision Landing Page

**Estructura de Carpetas Completa del Proyecto**

```
web-forward-react/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Barra de navegación responsiva
│   │   ├── Hero.jsx             # Sección Hero con animaciones
│   │   ├── Services.jsx         # Grid de servicios interactivo
│   │   ├── ContactForm.jsx      # Formulario de contacto validado
│   │   ├── ChatbotWidget.jsx    # Widget de chat flotante
│   │   └── Footer.jsx           # Pie de página
│   ├── pages/
│   │   └── (Para futuras páginas)
│   ├── App.jsx                  # Componente principal
│   ├── main.jsx                 # Punto de entrada
│   └── index.css                # Estilos globales
├── public/                      # Archivos estáticos
├── index.html                   # HTML principal
├── package.json                 # Dependencias
├── vite.config.js              # Configuración de Vite
├── tailwind.config.js          # Configuración de Tailwind
├── postcss.config.js           # Configuración de PostCSS
├── .eslintrc.cjs               # Configuración de ESLint
└── .gitignore                  # Archivos ignorados por Git

```

## 🎯 Características Implementadas

✅ **Diseño Responsivo Mobile-First**
- Completamente adaptable a todos los dispositivos
- Menú hamburguesa en móvil
- Grid flexible en tablets y desktop

✅ **Animaciones Fluidas (Framer Motion)**
- Fade-in up en Hero
- Scale effects en tarjetas de servicios
- Scroll suave
- Animaciones de entrada en scroll

✅ **Formulario de Contacto**
- Validación completa de campos
- Estados: Enviando, Éxito, Error
- Integración con Formspree (sin backend)
- Sanitización de entrada

✅ **Navbar Dinámica**
- Cambia de estilo al hacer scroll
- Menú responsivo
- Links suave de navegación

✅ **Widget de Chatbot**
- Flotante e independiente
- Animaciones de apertura/cierre
- Sistema de mensajes simulado

✅ **Paleta de Colores Profesional**
- Azules profundos (#0c3d66, #075985)
- Blancos y grises técnicos
- Gradientes modernos

✅ **Iconografía Lucide-React**
- 30+ iconos optimizados
- Responsive y escalables

## 🚀 Instalación y Uso

```bash
# 1. Ir al directorio del proyecto
cd web-forward-react

# 2. Instalar dependencias
npm install

# 3. Ejecutar en desarrollo
npm run dev

# 4. Construir para producción
npm run build

# 5. Vista previa de producción
npm run preview
```

## 📝 Configuración de Formspree

Para que el formulario funcione, debes configurar Formspree:

1. Ve a https://formspree.io/
2. Crea una cuenta y un nuevo proyecto
3. Copia tu Form ID
4. En [ContactForm.jsx](src/components/ContactForm.jsx), línea 63, reemplaza `YOUR_FORM_ID` con tu Form ID

**Antes (línea 63):**
```javascript
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
```

**Después:**
```javascript
const response = await fetch('https://formspree.io/f/abc12def', {
```

## 🎨 Personalización

### Cambiar Colores
Edita [tailwind.config.js](tailwind.config.js) en la sección `colors`:

```javascript
primary: {
  600: '#0284c7',  // Azul principal
  800: '#075985',  // Azul oscuro
}
```

### Cambiar Contenido
- **Textos:** Edita cada componente en `src/components/`
- **Iconos:** Importa nuevos iconos de `lucide-react`
- **Estilos:** Usa clases Tailwind en los componentes

### Agregar Secciones
```javascript
// En App.jsx
import MiNuevaSeccion from './components/MiNuevaSeccion'

// En el return
<MiNuevaSeccion />
```

## 🔧 Stack Tecnológico

- **React 18** - Librería de UI
- **Vite** - Bundler ultra rápido
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animaciones avanzadas
- **Lucide React** - Iconografía moderna
- **EmailJS/Formspree** - Sin backend

## 📱 Características Mobile-First

- Menú hamburguesa adaptativo
- Texto legible en todos los tamaños
- Botones tácticos optimizados
- Scroll suave en móvil
- Formulario optimizado para touch

## 🔐 Seguridad

- Validación de formularios en cliente
- Sanitización de entradas
- HTTPS recomendado en producción
- No almacena datos sensibles

## 📊 Rendimiento

- Lazy loading de componentes
- Optimización de imágenes
- CSS crítico inlineado
- Compresión automática con Vite

## 🤝 Soporte

Para cualquier duda o mejora, abre un issue en GitHub o contacta al equipo.

---

**¡Listo para despegar tu presencia digital con Forward Vision! 🚀**
