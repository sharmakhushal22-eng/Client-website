'use client'

import { useEffect, useState, type RefObject } from 'react'

/** True while the element is at least `threshold` visible. Starts false. */
export function useInView(ref: RefObject<Element | null>, threshold = 0.25, rootMargin = '0px') {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold, rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold, rootMargin])
  return inView
}
