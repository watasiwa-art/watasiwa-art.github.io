import { motion } from 'motion/react'
import { Play } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import type { Project } from '../../data/site'
import { FrameMarks, Scene } from '../art/Scenes'
import { cx } from '../lib/cx'

function useFrameCount(active: boolean) {
  const [frame, setFrame] = useState(0)
  useEffect(() => {
    if (!active) return
    const id = window.setInterval(() => setFrame((f) => (f + 1) % 24), 1000 / 12)
    return () => window.clearInterval(id)
  }, [active])
  return frame
}

export function WorkCard({ project, index = 0 }: { project: Project; index?: number }) {
  const [hover, setHover] = useState(false)
  const frame = useFrameCount(hover)

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, delay: (index % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={cx(project.size === 'large' ? 'md:col-span-2' : 'md:col-span-1')}
    >
      <Link
        to={`/work/${project.slug}`}
        className="group block"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          className={cx(
            'relative overflow-hidden border border-line',
            project.size === 'large' ? 'aspect-[16/10]' : 'aspect-[4/5]',
          )}
        >
          <Scene
            id={project.scene}
            src={project.image}
            playing={hover}
            className="transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(8_7_10/0.88),rgb(8_7_10/0.12)_36%,transparent_62%)]" />
          <FrameMarks cut={`${project.cut} · ${project.categoryJp}`} meta={project.year} />

          <span
            className={cx(
              'absolute left-1/2 top-1/2 z-10 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-fg/40 bg-bg/40 backdrop-blur-sm transition-all duration-500',
              hover ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
            )}
          >
            <Play className="size-4 translate-x-[1px] fill-current" />
          </span>

          <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-4 sm:p-5">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
                {project.category}
              </p>
              <h3 className="font-display mt-1.5 text-[26px] leading-none sm:text-[34px]">
                {project.title}
              </h3>
              <p className="font-jp mt-1.5 text-[10.5px] text-fg/60">{project.titleJp}</p>
            </div>
            <span className="font-mono text-[9px] tabular-nums tracking-[0.18em] text-fg/60">
              F {String(frame).padStart(2, '0')}
            </span>
          </div>

          <span
            className={cx(
              'absolute inset-x-0 bottom-0 z-10 h-[2px] origin-left bg-accent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
              hover ? 'scale-x-100' : 'scale-x-0',
            )}
          />
        </div>

        <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-line pt-2">
          <p className="text-[12.5px] text-muted">{project.role.slice(0, 2).join(' · ')}</p>
          <p className="eyebrow text-faint">{project.year}</p>
        </div>
      </Link>
    </motion.div>
  )
}
