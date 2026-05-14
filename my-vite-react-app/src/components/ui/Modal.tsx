import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  title: string
  description: string
  children: ReactNode
  action?: ReactNode
  onClose?: () => void
}

export function Modal({
  open,
  title,
  description,
  children,
  action,
  onClose,
}: ModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-6 py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-xl"
            onClick={onClose}
          />
          <motion.div
            className="relative z-10 max-w-xl rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-glow"
            initial={{ y: 24, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-accent/80">Threshold</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
              </div>
              <div>{children}</div>
              {action ? <div className="mt-4">{action}</div> : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
