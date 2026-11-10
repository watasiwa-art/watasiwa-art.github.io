import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'

import { about, experience, site, stats, studioSpec } from '../../data/site'
import { FrameMarks, Scene } from '../art/Scenes'
import { Lines, Reveal } from '../components/motion'

export function About() {
  return (
    <article className="mx-auto max-w-[1500px] px-5 pt-24 sm:px-8 sm:pt-32">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-16">
        <div>
          <p className="eyebrow text-accent">About / 略歴</p>
          <Lines
            as="h1"
            className="font-display mt-3 text-[clamp(46px,8vw,116px)]"
            lines={['Animator', 'first.']}
          />
          <Reveal delay={0.15} className="mt-7 max-w-lg">
            <p className="text-balance text-[19px] leading-[1.45] text-fg sm:text-[23px]">
              “{about.statement}”
            </p>
            <p className="font-jp mt-5 text-[12px] text-muted">
              {site.nameJp} / {site.roleJp}
            </p>
          </Reveal>
          <Reveal delay={0.25} className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
            {site.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="link-draw inline-flex items-center gap-1 text-[13px] text-muted transition-colors hover:text-fg"
              >
                {social.label}
                <ArrowUpRight className="size-3.5" />
              </a>
            ))}
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative aspect-[4/5] overflow-hidden border border-line">
          <Scene id="portrait" src={site.images.portrait} />
          <FrameMarks cut="SELF / 自画像" meta={site.nameJp} />
        </Reveal>
      </div>

      <div className="mt-20 grid gap-12 border-t border-line pt-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div>
          <p className="eyebrow text-accent">Why animation / 理由</p>
          <h2 className="font-display mt-2 text-[clamp(28px,3.6vw,42px)]">
            The frames
            <br />
            in between
          </h2>
        </div>
        <div className="max-w-2xl">
          {about.paragraphs.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p className={i === 0 ? 'text-pretty text-[17px] leading-relaxed text-fg/90' : 'mt-5 text-pretty text-[14.5px] leading-relaxed text-muted'}>
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-16 grid gap-10 border-t border-line pt-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div>
          <p className="eyebrow text-accent">What I am asking for / 希望</p>
          <h2 className="font-display mt-2 text-[clamp(28px,3.6vw,42px)]">The ask</h2>
        </div>
        <ul className="max-w-2xl border-t border-line">
          {about.why.map((item) => (
            <li key={item} className="flex gap-4 border-b border-line py-4">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
              <p className="text-[14.5px] leading-relaxed text-muted">{item}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-16 grid gap-12 border-t border-line pt-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div>
          <p className="eyebrow text-accent">Experience / 経歴</p>
          <h2 className="font-display mt-2 text-[clamp(28px,3.6vw,42px)]">So far</h2>
        </div>
        <ol className="border-t border-line">
          {experience.map((item) => (
            <li key={item.title} className="grid gap-1 border-b border-line py-5 sm:grid-cols-[150px_1fr]">
              <span className="eyebrow pt-1 text-faint">{item.period}</span>
              <span>
                <span className="block text-[15.5px] text-fg">{item.title}</span>
                <span className="mt-1 block text-[13px] leading-relaxed text-muted">{item.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-16 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-line px-5 py-6">
            <p className="font-display text-[clamp(36px,5vw,56px)] leading-none">{stat.value}</p>
            <p className="eyebrow mt-3 text-faint">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 border border-line bg-surface p-6 sm:p-10">
        <p className="eyebrow text-accent">Studio spec / 条件</p>
        <div className="mt-7 grid gap-8 sm:grid-cols-3">
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

      <div className="mt-16 flex flex-wrap items-center justify-between gap-5 border-t border-line pt-8">
        <p className="max-w-md text-[14px] leading-relaxed text-muted">
          If your studio needs a pair of hands on a cut, a test, or a 動画 seat, I would like to hear
          about it.
        </p>
        <Link
          to="/#contact"
          className="group inline-flex items-center gap-2 border border-fg px-5 py-3 text-[13px] uppercase tracking-[0.14em] transition-colors hover:bg-fg hover:text-bg"
        >
          Get in touch
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
        </Link>
      </div>
    </article>
  )
}
