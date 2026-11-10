import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import { ArrowDown, ArrowUpRight, Play, Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link } from 'react-router'

import { about, capabilities, process, projects, reel, site, stats, studioSpec } from '../../data/site'
import { FrameMarks, Scene } from '../art/Scenes'
import { Lines, Magnetic, Reveal } from '../components/motion'
import { ReelPlayer } from '../components/Showreel'
import { WorkCard } from '../components/WorkCard'
import { cx } from '../lib/cx'

const ease = [0.22, 1, 0.36, 1] as const

export function Home() {
  const [reelOpen, setReelOpen] = useState(false)
  const closeReel = useCallback(() => setReelOpen(false), [])

  return (
    <>
      <Hero />
      <Marquee />
      <ReelSection onPlay={() => setReelOpen(true)} />
      <CutsSection />
      <ProcessSection />
      <CapabilitiesSection />
      <SpecSection />
      <AboutTeaser />
      <ReelPlayer open={reelOpen} onClose={closeReel} />
    </>
  )
}

function Hero() {
  const mx = useSpring(useMotionValue(0), { stiffness: 45, damping: 18 })
  const my = useSpring(useMotionValue(0), { stiffness: 45, damping: 18 })

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        mx.set(((event.clientX - rect.left) / rect.width - 0.5) * -30)
        my.set(((event.clientY - rect.top) / rect.height - 0.5) * -18)
      }}
      onMouseLeave={() => {
        mx.set(0)
        my.set(0)
      }}
    >
      <motion.div style={{ x: mx, y: my }} className="absolute inset-[-2%]">
        <Scene id="wind" src={site.images.hero} />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(10_9_11/0.75),rgb(10_9_11/0.05)_34%,rgb(10_9_11/0.45)_62%,#0a090b_100%)]" />
      <div className="grain absolute inset-0" />
      <FrameMarks cut="CUT 001 · 原画" meta="16:9 · 24 FPS" />

      <div className="relative z-20 mx-auto flex min-h-[100svh] w-full max-w-[1500px] flex-col justify-between px-5 pb-7 pt-24 sm:px-8 sm:pb-10">
        <div className="flex items-start justify-between gap-4">
          <p className="eyebrow text-fg/70">Portfolio 2026 / 作品集</p>
          <p className="eyebrow flex items-center gap-2 text-fg/70">
            <span className="size-1.5 animate-pulse rounded-full bg-accent" />
            Open to studio work
          </p>
        </div>

        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.9 }}
            className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent"
          >
            {site.role} — {site.roleDetail}
          </motion.p>

          <h1 className="font-display mt-3 text-[clamp(56px,12.4vw,196px)] leading-[0.82]">
            {site.heroName.map((line, i) => (
              <span key={line} className="-mb-[0.04em] block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  initial={{ y: '106%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.15, delay: 0.2 + i * 0.1, ease }}
                >
                  {line}
                  {i === site.heroName.length - 1 && <span className="text-accent">.</span>}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65, ease }}
            className="mt-6 grid gap-6 border-t border-fg/20 pt-5 sm:grid-cols-[1.1fr_0.9fr] sm:items-end"
          >
            <p className="max-w-lg text-pretty text-[15.5px] leading-relaxed text-fg/85 sm:text-[17px]">
              {site.intro}
            </p>
            <div className="flex flex-wrap items-end justify-between gap-5 sm:justify-end sm:text-right">
              <div>
                <p className="font-jp text-[12px] text-fg/80">{site.roleJp}</p>
                <p className="eyebrow mt-2 text-fg/50">
                  {site.location} → {site.target}
                </p>
              </div>
              <Link
                to="/#work"
                className="group inline-flex items-center gap-2 border border-fg/30 px-4 py-2.5 text-[12px] uppercase tracking-[0.16em] transition-colors hover:border-fg hover:bg-fg hover:text-bg"
              >
                See the cuts
                <ArrowDown className="size-3.5 transition-transform duration-500 group-hover:translate-y-0.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Marquee() {
  return (
    <div className="overflow-hidden border-y border-line bg-surface py-4" aria-hidden>
      <ul className="font-display flex w-max animate-marquee items-center gap-9 whitespace-nowrap text-[26px] text-fg/75 sm:text-[34px]">
        {[...site.marquee, ...site.marquee].map((item, i) => (
          <li key={i} className="flex items-center gap-9">
            {item}
            <span className="size-1.5 rounded-full bg-accent" />
          </li>
        ))}
      </ul>
    </div>
  )
}

function ReelSection({ onPlay }: { onPlay: () => void }) {
  return (
    <section id="reel" className="mx-auto max-w-[1500px] scroll-mt-20 px-5 pt-20 sm:px-8 sm:pt-28">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <p className="eyebrow text-accent">作品集 / Showreel</p>
          <h2 className="font-display mt-2 text-[clamp(38px,6vw,76px)]">Six cuts, in motion</h2>
        </div>
        <div className="text-right">
          <p className="eyebrow text-faint">
            {reel.year} · {reel.runtime}
          </p>
          <p className="mt-1.5 text-[12px] text-muted">{reel.note}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onPlay}
        className="group relative mt-7 block w-full overflow-hidden border border-line text-left"
      >
        <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
          <Scene
            id="rooftop"
            src={reel.cover}
            className="transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(8_7_10/0.92),rgb(8_7_10/0.15)_70%)]" />
          <FrameMarks cut="REEL 2026" meta={`${projects.length} cuts`} />

          <span className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <Magnetic>
              <span className="grid size-20 place-items-center rounded-full border border-fg/50 bg-bg/30 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:border-accent group-hover:bg-accent sm:size-24">
                <Play className="size-5 translate-x-[2px] fill-current" />
              </span>
            </Magnetic>
          </span>

          <span className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-end justify-between gap-3 p-4 sm:p-6">
            <span>
              <span className="font-jp block text-[11px] text-accent">作品集 2026</span>
              <span className="font-display mt-1.5 block text-[clamp(26px,4vw,46px)]">Play the reel</span>
            </span>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-fg/60">
              Key animation · BG · Design
            </span>
          </span>
        </div>
      </button>
    </section>
  )
}

function CutsSection() {
  return (
    <section id="work" className="mx-auto max-w-[1500px] scroll-mt-20 px-5 pt-20 sm:px-8 sm:pt-28">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <p className="eyebrow text-accent">主なカット / Selected cuts</p>
          <h2 className="font-display mt-2 text-[clamp(38px,6vw,76px)]">The work</h2>
        </div>
        <p className="eyebrow text-faint">
          {projects.length} personal studies · 2024 — 2026
        </p>
      </div>

      <div className="mt-8 grid gap-x-5 gap-y-12 md:grid-cols-2 lg:gap-x-6 lg:gap-y-16">
        {projects.map((project, i) => (
          <WorkCard key={project.slug} project={project} index={i} />
        ))}
      </div>
    </section>
  )
}

function ProcessSection() {
  return (
    <section className="mx-auto max-w-[1500px] px-5 pt-24 sm:px-8 sm:pt-32">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <p className="eyebrow text-accent">制作の流れ / Process</p>
          <h2 className="font-display mt-2 text-[clamp(38px,6vw,76px)]">How a cut gets made</h2>
        </div>
        <p className="max-w-[34ch] text-[13px] leading-relaxed text-muted">
          Six stages, one drawing at a time. I can join at any of them, and I know what the next
          person needs from me at each one.
        </p>
      </div>

      <div className="grid border-t border-line sm:grid-cols-2 lg:grid-cols-6">
        {process.map((stage, i) => (
          <div
            key={stage.en}
            className="group border-b border-line py-6 lg:border-b-0 lg:border-r lg:px-5 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
          >
            <p className="font-mono text-[10px] tabular-nums text-faint">0{i + 1}</p>
            <p className="font-jp mt-6 text-[26px] leading-none text-fg transition-colors duration-300 group-hover:text-accent">
              {stage.jp}
            </p>
            <p className="eyebrow mt-2 text-muted">{stage.en}</p>
            <p className="mt-3 text-[12.5px] leading-relaxed text-muted">{stage.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function CapabilitiesSection() {
  const [open, setOpen] = useState(0)

  return (
    <section className="mx-auto max-w-[1500px] px-5 pt-24 sm:px-8 sm:pt-32">
      <div className="grid gap-8 border-b border-line pb-4 lg:grid-cols-[1fr_2fr] lg:gap-20">
        <div>
          <p className="eyebrow text-accent">できること / Capabilities</p>
          <h2 className="font-display mt-2 text-[clamp(38px,6vw,76px)]">What I can take</h2>
        </div>
        <p className="max-w-md self-end text-[13px] leading-relaxed text-muted">
          Four jobs, done properly. Most cuts need two of them, and I would rather be honest about
          the ones I am still learning.
        </p>
      </div>

      <ul className="border-t border-line">
        {capabilities.map((item, i) => {
          const isOpen = open === i
          return (
            <li key={item.title} className="border-b border-line">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="group flex w-full items-center gap-5 py-6 text-left sm:gap-8"
              >
                <span className="font-mono w-8 shrink-0 text-[10px] tabular-nums text-faint">
                  0{i + 1}
                </span>
                <span className="flex-1">
                  <span
                    className={cx(
                      'font-display block text-[30px] transition-colors sm:text-[46px]',
                      isOpen ? 'text-fg' : 'text-fg/55 group-hover:text-fg',
                    )}
                  >
                    {item.title}
                  </span>
                  <span className="font-jp mt-1 block text-[11px] text-faint">{item.titleJp}</span>
                </span>
                <span
                  className={cx(
                    'grid size-10 shrink-0 place-items-center border border-line-strong transition-colors duration-300',
                    isOpen && 'border-accent bg-accent text-white',
                  )}
                >
                  <Plus className={cx('size-4 transition-transform duration-500', isOpen && 'rotate-45')} />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-xl pb-8 pl-13 text-pretty text-[15px] leading-relaxed text-muted sm:pl-[72px]">
                      {item.body}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function SpecSection() {
  return (
    <section className="mx-auto max-w-[1500px] px-5 pt-24 sm:px-8 sm:pt-32">
      <div className="border border-line bg-surface">
        <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[0.85fr_2fr] lg:gap-16">
          <div>
            <p className="eyebrow text-accent">Studio spec / 条件</p>
            <h2 className="font-display mt-3 text-[clamp(32px,4.4vw,52px)]">
              Ready for a
              <br />
              production line
            </h2>
            <p className="mt-4 text-[13px] leading-relaxed text-muted">
              I know the difference between a drawing that looks good and a drawing that the next
              person can use. The second one is the job.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {studioSpec.map((column) => (
              <div key={column.title}>
                <p className="eyebrow border-b border-line pb-2 text-fg">{column.title}</p>
                <p className="font-jp mt-1.5 text-[10px] text-faint">{column.titleJp}</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {column.rows.map((row) => (
                    <li key={row} className="text-[12.5px] leading-snug text-muted">
                      {row}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="grid border-t border-line sm:grid-cols-3">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={cx(
                'px-6 py-7 sm:px-10',
                i > 0 && 'border-t border-line sm:border-l sm:border-t-0',
              )}
            >
              <p className="font-display text-[clamp(38px,5vw,60px)] leading-none">{stat.value}</p>
              <p className="eyebrow mt-3 text-faint">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutTeaser() {
  return (
    <section className="mx-auto max-w-[1500px] px-5 pt-24 sm:px-8 sm:pt-32">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
        <Reveal className="relative aspect-[4/5] overflow-hidden border border-line">
          <Scene id="portrait" src={site.images.portrait} />
          <FrameMarks cut="SELF / 自画像" meta="2026" />
        </Reveal>

        <div>
          <p className="eyebrow text-accent">About / 略歴</p>
          <Lines
            as="h2"
            className="font-display mt-3 text-balance text-[clamp(34px,5.4vw,66px)]"
            lines={['Animator first,', 'everything else', 'second']}
          />
          <Reveal delay={0.15} className="mt-6 max-w-xl">
            <p className="text-pretty text-[17px] leading-relaxed text-fg/85">{about.paragraphs[0]}</p>
            <p className="mt-4 text-pretty text-[14.5px] leading-relaxed text-muted">
              Self-taught, four years in, currently in {site.location} and aiming at {site.target}.
              Looking for a seat in key animation or in-between animation, and happy to start at
              動画.
            </p>
          </Reveal>
          <Reveal delay={0.25} className="mt-8">
            <Link
              to="/about"
              className="link-draw inline-flex items-center gap-1.5 text-[14px] font-medium"
            >
              Read the long version
              <ArrowUpRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
