import { motion } from 'motion/react'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router'

import { bySlug, projects } from '../../data/site'
import { FrameMarks, Scene } from '../art/Scenes'
import { Lines, Reveal } from '../components/motion'

const ease = [0.22, 1, 0.36, 1] as const

export function Work() {
  const { slug } = useParams()
  const project = slug ? bySlug(slug) : undefined
  if (!project) return <Navigate to="/" replace />

  const index = projects.findIndex((p) => p.slug === project.slug)
  const next = projects[(index + 1) % projects.length]

  return (
    <article className="mx-auto max-w-[1500px] px-5 pt-24 sm:px-8 sm:pt-32">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <Link
          to="/#work"
          className="eyebrow flex items-center gap-1.5 text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-3.5" />
          All cuts
        </Link>
        <p className="eyebrow text-faint">
          {project.cut} · {project.year}
        </p>
      </div>

      <div className="mt-9 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow text-accent">
            {project.category} / {project.categoryJp}
          </p>
          <Lines
            as="h1"
            className="font-display mt-3 text-[clamp(50px,9vw,138px)]"
            lines={[project.title]}
          />
          <p className="font-jp mt-3 text-[15px] text-muted">{project.titleJp}</p>
        </div>
        <Reveal delay={0.2} className="max-w-md text-pretty text-[15.5px] leading-relaxed text-muted lg:pb-3">
          {project.summary}
        </Reveal>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.15, ease }}
        className="relative mt-9 aspect-[16/9] overflow-hidden border border-line"
      >
        <Scene id={project.scene} src={project.image} playing />
        <FrameMarks cut={project.cut} meta="16:9 · 24 FPS" />
      </motion.div>

      <div className="mt-14 grid gap-12 lg:grid-cols-[300px_1fr] lg:gap-24">
        <Reveal>
          <dl className="border-t border-line">
            {[...project.specs, ['Role', project.role.join(', ')] as [string, string]].map(
              ([label, value]) => (
                <div key={label} className="flex gap-4 border-b border-line py-3.5">
                  <dt className="eyebrow w-24 shrink-0 pt-1 text-faint">{label}</dt>
                  <dd className="text-[13.5px] leading-snug text-fg/90">{value}</dd>
                </div>
              ),
            )}
          </dl>
        </Reveal>

        <div className="max-w-2xl">
          {project.body.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p
                className={
                  i === 0
                    ? 'text-pretty text-[19px] leading-relaxed text-fg sm:text-[21px]'
                    : 'mt-6 text-pretty text-[15px] leading-relaxed text-muted'
                }
              >
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <div className="flex items-baseline justify-between border-b border-line pb-3">
          <p className="eyebrow text-accent">Frames / 原画</p>
          <p className="eyebrow text-faint">{project.frames.length} stills</p>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {project.frames.map((frame, i) => (
            <Reveal key={frame.label} delay={i * 0.08}>
              <figure className="group relative aspect-[4/3] overflow-hidden border border-line">
                <Scene
                  id={project.scene}
                  src={frame.image ?? project.image}
                  zoom={frame.zoom}
                  origin={frame.origin}
                  playing
                />
                <FrameMarks cut={frame.label} />
                <div className="absolute inset-x-0 bottom-0 z-10 bg-[linear-gradient(to_top,rgb(8_7_10/0.94),transparent)] p-3.5 pt-10">
                  <p className="font-jp text-[10px] text-accent">{frame.jp}</p>
                  <p className="mt-1 text-[11.5px] leading-snug text-fg/85">{frame.caption}</p>
                </div>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>

      <Link
        to={`/work/${next.slug}`}
        className="group mt-24 block border-t border-line pt-6 sm:mt-32"
      >
        <div className="flex items-center justify-between">
          <p className="eyebrow text-muted">Next cut</p>
          <p className="eyebrow text-faint">
            {next.cut} · {next.categoryJp}
          </p>
        </div>
        <div className="mt-4 flex items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(40px,7.5vw,110px)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2">
            {next.title}
          </h2>
          <span className="relative hidden aspect-[3/2] w-[240px] shrink-0 overflow-hidden border border-line sm:block">
            <Scene
              id={next.scene}
              src={next.image}
              className="transition-transform duration-700 group-hover:scale-105"
            />
          </span>
        </div>
        <p className="font-jp mt-2 text-[12px] text-muted">{next.titleJp}</p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] text-accent">
          Open cut
          <ArrowUpRight className="size-4" />
        </span>
      </Link>
    </article>
  )
}
