import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import Promociones from '../components/Promociones'
import Services from '../components/Services'
import Gallery from '../components/Gallery'
import Testimonials from '../components/Testimonials'
import ContactForm from '../components/ContactForm'

export default function Inicio() {
  return (
    <>
      <Helmet>
        <title>Forward Vision | Internet Fibra Óptica Giga y TV Digital</title>

        <meta name="description" content="Forward Vision ofrece el internet de fibra óptica más rápido de la región. Velocidad simétrica, baja latencia para gaming y TV digital 4K. ¡Contrata hoy!" />
        <meta name="keywords" content="internet fibra optica, velocidad giga, tv digital, internet simetrico, forward vision, mejor internet" />
        <link rel="canonical" href="https://forwardvision.cloud/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://forwardvision.cloud/" />
        <meta property="og:title" content="Forward Vision | Internet Fibra Óptica Giga" />
        <meta property="og:description" content="Conectividad total con fibra óptica real. Planes Giga y TV Digital para tu hogar." />
        <meta property="og:image" content="https://forwardvision.cloud/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://forwardvision.cloud/" />
        <meta property="twitter:title" content="Forward Vision | Internet Fibra Óptica Giga" />
        <meta property="twitter:description" content="Conectividad total con fibra óptica real. Planes Giga y TV Digital para tu hogar." />
        <meta property="twitter:image" content="https://forwardvision.cloud/og-image.png" />
      </Helmet>
      <motion.main
        className="overflow-x-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section (contiene el logo 3D) */}
        <Hero />

        {/* Promociones Especiales — justo después del logo 3D */}
        <Promociones />

        {/* Services Section */}
        <Services />

        {/* Gallery Section */}
        <Gallery />

        {/* Testimonios / Lo que dicen nuestros clientes */}
        <Testimonials />

        {/* Contact Section */}
        <ContactForm />
      </motion.main>
    </>
  )
}
