import { useEffect, useState } from 'react'
import { ParallaxSection } from './components/ParallaxSection'
import { PrayerRequestForm } from './features/prayer/PrayerRequestForm'
import { ThresholdAuthModal } from './features/auth/ThresholdAuthModal'
import { supabase } from './lib/supabaseClient'
import type { Session } from '@supabase/supabase-js'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null

    const initializeAuth = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setIsLoading(false)

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession)
      })

      subscription = authListener.subscription
    }

    initializeAuth()

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-base text-text">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(163,177,138,0.14),transparent_24%),linear-gradient(180deg,#121212_0%,#060606_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <svg width="0" height="0" aria-hidden="true">
          <filter id="grain-filter">
            <feTurbulence type="fractalNoise" baseFrequency="2.5" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.03" />
            </feComponentTransfer>
          </filter>
        </svg>
      </div>

      <main className="relative isolate">
        <section className="relative px-6 pt-16 pb-24 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm uppercase tracking-[0.36em] text-accent/80">Cinematic Minimalism</p>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
              Sacred Space — a meditation platform where technology fades and atmosphere remains.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Explore prayer requests, scripture reflections, and a layered visual rhythm tuned for stillness.
            </p>
          </div>
        </section>

        <ParallaxSection
          backImage="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
          frontImage="https://images.unsplash.com/photo-1470115636492-6d2b56fdb7da?auto=format&fit=crop&w=1600&q=80"
        >
          <div className="space-y-8 text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-accent/80">Scripture</p>
            <div className="mx-auto max-w-3xl space-y-6">
              <h2 className="text-4xl font-semibold leading-tight text-white">
                Enter a three-tier prayer atmosphere designed for reflection.
              </h2>
              <p className="text-base leading-8 text-slate-300">
                The scripture card stays centered while the landscape and floating glyphs move around it, keeping your focus grounded.
              </p>
            </div>
          </div>
        </ParallaxSection>

        <section className="relative px-6 py-20 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <PrayerRequestForm session={session} />
          </div>
        </section>
      </main>

      <ThresholdAuthModal open={!session && !isLoading} isLoading={isLoading} onSignIn={handleSignIn} />
    </div>
  )
}

export default App
