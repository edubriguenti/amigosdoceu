import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/**
 * Overlay acessível para os modais do álbum: Esc fecha, foco inicial no diálogo,
 * foco devolvido ao elemento anterior e rolagem da página travada.
 */
export default function ModalBase({ onClose, label, children, className = '' }) {
  const ref = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const anterior = document.activeElement
    ref.current?.focus()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onCloseRef.current()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      if (anterior && typeof anterior.focus === 'function') anterior.focus()
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070f]/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`relative my-auto focus:outline-none ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </motion.div>
  )
}
