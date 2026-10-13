import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import Promociones from '../components/Promociones'
import Services from '../components/Services'
import Gallery from '../components/Gallery'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import ContactForm from '../components/ContactForm'

export default function Inicio() {
  return (
    <>
      <Helmet>
        <title>Internet por Fibra Óptica en Lima Este | Forward Vision</title>

        <meta name="description" content="Internet por fibra óptica y TV digital en Lima Este. Consulta cobertura en Ate, Santa Anita, Chosica, Carapongo, Santa Clara y zonas cercanas." />
        <meta name="keywords" content="internet fibra óptica Lima Este, internet Ate, internet Santa Anita, internet Chosica, internet Carapongo, internet Santa Clara, Forward Vision" />
        <link rel="canonical" href="https://forwardvision.cloud/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://forwardvision.cloud/" />
        <meta property="og:title" content="Internet por Fibra Óptica en Lima Este | Forward Vision" />
        <meta property="og:description" content="Consulta cobertura de internet por fibra óptica en Ate, Santa Anita, Chosica, Carapongo, Santa Clara y zonas cercanas." />
        <meta property="og:image" content="https://forwardvision.cloud/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://forwardvision.cloud/" />
        <meta property="twitter:title" content="Internet por Fibra Óptica en Lima Este | Forward Vision" />
        <meta property="twitter:description" content="Consulta cobertura de internet por fibra óptica en Ate, Santa Anita, Chosica, Carapongo, Santa Clara y zonas cercanas." />
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

        {/* FAQ Section */}
        <FAQ />

        {/* Contact Section */}
        <ContactForm />
      </motion.main>
    </>
  )
}
