import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { projects, reel } from '../../data/site'
import { FrameMarks, Scene } from '../art/Scenes'
import { cx } from '../lib/cx'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * A reel that does not need a video file: it cuts between the six pieces on a
 * fixed interval, the way a showreel would. Replace the Scene with a <video>
 * once the actual reel exists.
 */
export function ReelPlayer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!open) return
    setIndex(0)
    const timer = reel.video
      ? undefined
      : window.setInterval(() => setIndex((i) => (i + 1) % projects.length), 2800)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      if (timer) window.clearInterval(timer)
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const current = projects[index]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Showreel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[95] flex flex-col bg-bg"
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-8">
            <div className="flex items-baseline gap-3">
              <p className="font-display text-[18px]">{reel.title}</p>
              <p className="font-jp text-[10.5px] text-muted">
                {reel.titleJp} · {reel.year} · {reel.runtime}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close reel"
              className="grid size-9 place-items-center border border-line text-muted transition-colors hover:border-fg hover:text-fg"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="relative flex-1 overflow-hidden">
            {reel.video ? (
              <video
                src={reel.video}
                controls
                autoPlay
                loop
                playsInline
                className="absolute inset-0 size-full bg-black object-contain"
              />
            ) : (
            <AnimatePresence mode="popLayout">
              <motion.div
                key={current.slug}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease }}
                className="absolute inset-0"
              >
                <Scene id={current.scene} src={current.image} playing />
                <FrameMarks cut={current.cut} meta={`${index + 1} / ${projects.length}`} />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(8_7_10/0.9),transparent_58%)]" />
                <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-10">
                  <p className="font-jp text-[11.5px] text-accent">{current.titleJp}</p>
                  <h2 className="font-display mt-2 text-[clamp(34px,7vw,80px)]">{current.title}</h2>
                  <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-fg/70">{current.summary}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            )}
          </div>

          <div className="border-t border-line px-5 py-4 sm:px-8">
            {!reel.video && (
              <div className="flex gap-1.5">
                {projects.map((project, i) => (
                  <button
                    key={project.slug}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Cut ${project.title}`}
                    className={cx(
                      'h-[3px] flex-1 transition-colors',
                      i === index ? 'bg-accent' : 'bg-line hover:bg-line-strong',
                    )}
                  />
                ))}
              </div>
            )}
            <p className="mt-3 text-[11px] leading-relaxed text-faint">
              {reel.note}{' '}
              {reel.video
                ? 'Sound on. Headphones recommended.'
                : 'The reel is drawn in code — six cuts in sequence. Drop in your video and it becomes a real player.'}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
