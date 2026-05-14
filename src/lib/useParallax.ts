import { useEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger, Observer } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger, Observer)

export function useParallax(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const back = containerRef.current?.querySelector('.depth-back')
      const middle = containerRef.current?.querySelector('.depth-middle')
      const front = containerRef.current?.querySelector('.depth-front')

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top center',
          end: 'bottom top',
          scrub: 0.8,
        },
      })

      if (back) {
        timeline.to(back, { yPercent: -12, ease: 'none' }, 0)
      }

      if (middle) {
        timeline.to(middle, { yPercent: -5, ease: 'none' }, 0)
      }

      if (front) {
        timeline.to(front, { yPercent: 8, ease: 'none' }, 0)
      }
    }, containerRef.current)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [containerRef])
}
