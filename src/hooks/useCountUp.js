import { useState, useEffect, useRef } from 'react'

/**
 * Animates a number from 0 to `target` when the element enters the viewport.
 * @param {number} target  - Final number to count to
 * @param {number} duration - Animation duration in ms (default 2000)
 * @returns {{ ref, count }} - Attach `ref` to the container element
 */
export const useCountUp = (target, duration = 2000) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const steps = 60
          const increment = target / steps
          let current = 0

          const timer = setInterval(() => {
            current += increment
            if (current >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.4 }
    )

    const el = ref.current
    if (el) observer.observe(el)
    return () => { if (el) observer.unobserve(el) }
  }, [target, duration])

  return { ref, count }
}

export default useCountUp
