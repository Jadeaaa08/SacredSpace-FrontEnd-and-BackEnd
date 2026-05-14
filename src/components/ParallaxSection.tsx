import { useRef } from 'react'
import { useParallax } from '../lib/useParallax'
import { GlassCard } from './ui/GlassCard'
import type { ReactNode } from 'react'

interface ParallaxSectionProps {
  backImage: string
  frontImage: string
  children: ReactNode
}

export function ParallaxSection({ backImage, frontImage, children }: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  useParallax(sectionRef)

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-[110vh] overflow-hidden px-6 py-24 sm:px-10"
    >
      <div
        className="depth-back absolute inset-0 bg-cover bg-center opacity-90 grayscale"
        style={{
          backgroundImage: `linear-gradient(rgba(18, 18, 18, 0.36), rgba(18, 18, 18, 0.36)), url(${backImage})`,
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center">
        <GlassCard className="mx-auto w-full max-w-3xl px-8 py-12 sm:px-12 sm:py-16">
          {children}
        </GlassCard>
      </div>

      <div
        className="depth-front pointer-events-none absolute inset-x-0 bottom-0 top-14 z-0 bg-cover bg-center opacity-70 blur-2xl"
        style={{
          backgroundImage: `url(${frontImage})`,
        }}
      />
    </section>
  )
}
