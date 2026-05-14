import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchVerse, type VerseResult } from '../../lib/bibleApi'
import { supabase } from '../../lib/supabaseClient'
import { GlassCard } from '../../components/ui/GlassCard'
import type { Database } from '../../types/db'
import type { Session } from '@supabase/supabase-js'

const PrayerRequestSchema = z.object({
  requestBody: z.string().min(20, 'Please share at least 20 characters of prayer or reflection.'),
  scriptureRef: z.string().min(3, 'Enter a valid scripture reference.'),
})

type PrayerRequestInput = z.infer<typeof PrayerRequestSchema>

interface PrayerRequestFormProps {
  session: Session | null
}

export function PrayerRequestForm({ session }: PrayerRequestFormProps) {
  const [step, setStep] = useState(0)
  const [verse, setVerse] = useState<VerseResult | null>(null)
  const [loadingVerse, setLoadingVerse] = useState(false)
  const [submissionError, setSubmissionError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PrayerRequestInput>({
    resolver: zodResolver(PrayerRequestSchema),
    defaultValues: {
      requestBody: '',
      scriptureRef: 'John 3:16',
    },
  })

  const scriptureRef = watch('scriptureRef')

  useEffect(() => {
    if (!scriptureRef) {
      setVerse(null)
      return
    }

    setLoadingVerse(true)
    fetchVerse(scriptureRef)
      .then(setVerse)
      .finally(() => setLoadingVerse(false))
  }, [scriptureRef])

  const reviewText = useMemo(() => {
    if (step === 2 && verse) {
      return verse.text
    }
    return ''
  }, [step, verse])

  const onSubmit = async (values: PrayerRequestInput) => {
    setSubmissionError('')
    setSuccessMessage('')

    const payload: Database['public']['Tables']['prayer_requests']['Insert'] = {
      user_id: session?.user?.id ?? 'anonymous',
      request_body: values.requestBody,
      scripture_ref: values.scriptureRef,
      verse_content: verse?.text ?? null,
      parallax_config: {
        layers: ['back', 'middle', 'front'],
        offsets: { back: 0.2, middle: 0.6, front: 1.2 },
      },
    }

    const { error } = await supabase.from('prayer_requests' as const).insert([payload] as any)

    if (error) {
      setSubmissionError(error.message)
      return
    }

    setSuccessMessage('Your prayer request has been added to the sacred flow.')
    setStep(0)
    reset()
  }

  return (
    <GlassCard className="space-y-6 p-8 sm:p-10">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.36em] text-accent/80">Prayer request</p>
        <h3 className="text-3xl font-semibold text-white">Submit a scripture-guided intention</h3>
        <p className="max-w-2xl text-sm leading-7 text-slate-300">
          A minimal, multi-step canvas to shape your request before it enters the communal stream.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 0 ? (
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-200" htmlFor="requestBody">
              Prayer or reflection
            </label>
            <textarea
              id="requestBody"
              rows={5}
              className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white shadow-inner outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              {...register('requestBody')}
            />
            {errors.requestBody ? (
              <p className="text-sm text-rose-300">{errors.requestBody.message}</p>
            ) : null}
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-200" htmlFor="scriptureRef">
              Scripture reference
            </label>
            <input
              id="scriptureRef"
              type="text"
              className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              {...register('scriptureRef')}
            />
            {errors.scriptureRef ? (
              <p className="text-sm text-rose-300">{errors.scriptureRef.message}</p>
            ) : null}
            <div className="rounded-3xl border border-white/10 bg-black/10 p-4 text-sm text-slate-300">
              {loadingVerse ? 'Connecting to the scripture archive…' : verse?.text ?? 'Real-time scripture preview will appear here.'}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
            <p className="text-sm uppercase tracking-[0.3em] text-accent/80">Review before submission</p>
            <p className="text-white">Reference: {scriptureRef}</p>
            <p className="whitespace-pre-line">{reviewText}</p>
          </div>
        ) : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((current) => Math.max(current - 1, 0))}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white transition hover:border-accent"
              >
                Back
              </button>
            ) : null}
          </div>

          <button
            type={step === 2 ? 'submit' : 'button'}
            onClick={step === 2 ? undefined : () => setStep((current) => Math.min(current + 1, 2))}
            disabled={isSubmitting && step === 2}
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {step === 2 ? 'Submit prayer' : 'Continue'}
          </button>
        </div>

        {submissionError ? <p className="text-sm text-rose-300">{submissionError}</p> : null}
        {successMessage ? <p className="text-sm text-emerald-300">{successMessage}</p> : null}
      </form>
    </GlassCard>
  )
}
