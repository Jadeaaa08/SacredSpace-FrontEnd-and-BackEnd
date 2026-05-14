import { motion } from 'framer-motion'
import { Modal } from '../../components/ui/Modal'
import type { MouseEventHandler } from 'react'

interface ThresholdAuthModalProps {
  open: boolean
  isLoading: boolean
  onSignIn: MouseEventHandler<HTMLButtonElement>
}

export function ThresholdAuthModal({ open, isLoading, onSignIn }: ThresholdAuthModalProps) {
  return (
    <Modal
      open={open}
      title="Enter the Sacred Space"
      description="Authenticate to continue. Your presence unlocks the quiet ceremony of prayer and scripture." 
      action={
        <button
          type="button"
          onClick={onSignIn}
          className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black shadow-xl transition hover:scale-[1.01]"
        >
          Sign in with Google
        </button>
      }
    >
      {isLoading ? (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0.35 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <div className="h-40 rounded-[28px] bg-white/5 p-6 animate-pulse" />
          <div className="h-4 w-3/4 rounded-full bg-white/10" />
          <div className="h-4 w-1/2 rounded-full bg-white/10" />
        </motion.div>
      ) : (
        <div className="space-y-4 text-sm leading-7 text-slate-300">
          <p>
            This session will create a secure profile and let you add prayer requests that are visible to the community.
          </p>
          <p>Your details stay private unless you choose to share them.</p>
        </div>
      )}
    </Modal>
  )
}
