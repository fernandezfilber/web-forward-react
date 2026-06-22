import React from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, AlertTriangle } from 'lucide-react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
    // Si tienes Sentry en el frontend, puedes reportar aquí:
    // Sentry.captureException(error, { extra: info })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={36} className="text-red-400" />
            </div>
            <h1 className="text-2xl font-black text-white mb-3 tracking-tight">
              Algo salió mal
            </h1>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Ocurrió un error inesperado. Intenta recargar la página. Si el problema persiste,
              contacta a soporte.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="text-left text-xs text-red-400 bg-red-500/5 border border-red-500/10 rounded-xl p-4 mb-6 overflow-auto max-h-40">
                {this.state.error.toString()}
              </pre>
            )}
            <motion.button
              onClick={() => window.location.reload()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-black font-black text-sm uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all"
            >
              <RefreshCw size={16} />
              Recargar página
            </motion.button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
