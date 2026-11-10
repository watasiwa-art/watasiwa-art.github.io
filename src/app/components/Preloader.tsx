import { AnimatePresence, animate, motion } from 'motion/react'
import { useEffect, useState } from 'react'

import { site } from '../../data/site'

const pad = (n: number) => String(n).padStart(2, '0')

// A frame counter instead of a percentage: 24 frames, then the site opens.
// Skipped entirely when the user prefers reduced motion.
export function Preloader() {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    return !sessionStorage.getItem('preloaded')
  })
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (!show) return
    document.body.style.overflow = 'hidden'
    const controls = animate(0, 24, {
      duration: 1.15,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setFrame(Math.round(v)),
    })
    const timer = window.setTimeout(() => {
      setShow(false)
      sessionStorage.setItem('preloaded', '1')
    }, 1600)
    return () => {
      controls.stop()
      window.clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-bg p-5 text-fg sm:p-9"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="eyebrow flex items-start justify-between text-faint">
            <span className="text-accent">原画 / Genga</span>
            <span>Portfolio 2026</span>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-jp text-[12px] text-muted">タイミング</p>
              <p className="font-display mt-2 max-w-[9ch] text-[clamp(36px,8vw,78px)]">{site.navName}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[clamp(62px,15vw,180px)] leading-[0.78] tabular-nums">{pad(frame)}</p>
              <p className="eyebrow mt-3 text-faint">frame / 24 fps</p>
            </div>
          </div>

          <div className="h-px w-full bg-line">
            <motion.div
              className="h-px origin-left bg-accent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
