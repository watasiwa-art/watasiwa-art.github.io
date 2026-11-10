import { useId, type ReactNode } from 'react'

import type { SceneId } from '../../data/site'
import { cx } from '../lib/cx'

/**
 * The artwork. Every cut is drawn in code — flat vector scenes with a few slow
 * animations, so the portfolio moves without shipping video files.
 *
 * Pass `src` to swap any cut for your own image: it renders instead of the
 * drawn placeholder and is cropped with `object-cover` around `origin`.
 * Animated GIF, WebP and APNG all work in an <img>.
 */
export function Scene({
  id,
  src,
  zoom = 1,
  origin = '50% 50%',
  playing = false,
  className,
}: {
  id: SceneId
  src?: string
  zoom?: number
  origin?: string
  playing?: boolean
  className?: string
}) {
  const raw = useId()
  const u = 's' + raw.replace(/[^a-zA-Z0-9]/g, '')

  return (
    <div
      aria-hidden
      data-playing={playing ? 'true' : 'false'}
      className={cx('absolute inset-0 overflow-hidden bg-surface-2', className)}
    >
      {src ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          className="size-full object-cover"
          style={{
            objectPosition: origin,
            transform: zoom === 1 ? undefined : `scale(${zoom})`,
            transformOrigin: origin,
          }}
        />
      ) : (
        <svg
          viewBox="0 0 1000 625"
          preserveAspectRatio="xMidYMid slice"
          className="size-full"
          style={{ transform: `scale(${zoom})`, transformOrigin: origin }}
        >
          {builders[id](u)}
        </svg>
      )}
    </div>
  )
}

/** Frame corners, cut number and format: the markings of a film frame. */
export function FrameMarks({ cut, meta, className }: { cut?: string; meta?: string; className?: string }) {
  return (
    <div aria-hidden className={cx('pointer-events-none absolute inset-0 z-10', className)}>
      <span className="absolute left-3 top-3 size-3.5 border-l border-t border-fg/40" />
      <span className="absolute right-3 top-3 size-3.5 border-r border-t border-fg/40" />
      <span className="absolute bottom-3 left-3 size-3.5 border-b border-l border-fg/40" />
      <span className="absolute bottom-3 right-3 size-3.5 border-b border-r border-fg/40" />
      {cut && <span className="absolute left-4 top-4 mt-2 font-mono text-[9.5px] uppercase tracking-[0.2em] text-fg/85">{cut}</span>}
      {meta && <span className="absolute right-4 top-4 mt-2 font-mono text-[9.5px] uppercase tracking-[0.2em] text-fg/60">{meta}</span>}
    </div>
  )
}

type Build = (u: string) => ReactNode

function Petals({ count = 9, seed = 0 }: { count?: number; seed?: number }) {
  return (
    <g fill="#ffdcb8">
      {Array.from({ length: count }).map((_, i) => (
        <ellipse
          key={i}
          cx={30 + ((i * 131 + seed * 47) % 950)}
          cy={-40 - ((i * 73 + seed * 29) % 200)}
          rx="5"
          ry="2.4"
          opacity="0.78"
          className="art-petal"
          style={{ animationDelay: `${(i * 0.83).toFixed(2)}s`, animationDuration: `${7 + (i % 3)}s` }}
        />
      ))}
    </g>
  )
}

function Rain({ count = 22 }: { count?: number }) {
  return (
    <g stroke="#a8cfe3" strokeWidth="1.2" strokeLinecap="round" opacity="0.5">
      {Array.from({ length: count }).map((_, i) => (
        <line
          key={i}
          x1={20 + ((i * 89) % 980)}
          y1={-30 - ((i * 53) % 180)}
          x2={18 + ((i * 89) % 980)}
          y2={20 - ((i * 53) % 180)}
          className="art-rain"
          style={{ animationDelay: `${((i * 0.17) % 1.3).toFixed(2)}s`, animationDuration: `${1.1 + (i % 4) * 0.12}s` }}
        />
      ))}
    </g>
  )
}

const JP_FONT = "'Hiragino Kaku Gothic ProN', 'Yu Gothic', Meiryo, 'Noto Sans JP', sans-serif"

const builders: Record<SceneId, Build> = {
  wind: (u) => {
    const figure = (
      <g>
        <path d="M470 370 C452 400 440 440 430 474 L512 474 C500 440 488 400 470 370 Z" fill="#0e070d" />
        <path d="M470 315 L470 388" stroke="#0e070d" strokeWidth="22" strokeLinecap="round" />
        <path d="M456 462 L452 502" stroke="#0e070d" strokeWidth="8" strokeLinecap="round" />
        <path d="M486 462 L490 502" stroke="#0e070d" strokeWidth="8" strokeLinecap="round" />
        <path d="M470 330 L440 364 L432 402" stroke="#0e070d" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M470 330 L500 360 L514 394" stroke="#0e070d" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="470" cy="300" r="15" fill="#0e070d" />
        <path
          className="art-sway-slow"
          d="M452 298 C448 272 462 256 480 256 C498 256 510 270 506 290 C498 278 476 274 462 282 C457 285 454 291 452 298 Z"
          fill="#0e070d"
        />
        <path
          className="art-sway"
          d="M498 280 C514 272 530 276 538 288 C524 286 510 288 500 296 Z"
          fill="#0e070d"
        />
        <path
          className="art-sway"
          d="M474 318 C516 322 556 306 604 318 C628 324 642 334 648 346 C620 340 594 336 566 338 C526 340 500 336 476 330 Z"
          fill="#d3452c"
        />
        <path
          className="art-sway-slow"
          d="M476 330 C512 342 552 344 586 356 C552 364 512 356 480 344 Z"
          fill="#b63a24"
          opacity="0.9"
        />
      </g>
    )

    return (
      <>
        <defs>
          <linearGradient id={`${u}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#241528" />
            <stop offset="0.38" stopColor="#6d2333" />
            <stop offset="0.68" stopColor="#c9502c" />
            <stop offset="1" stopColor="#f2ab63" />
          </linearGradient>
          <radialGradient id={`${u}-sun`}>
            <stop offset="0" stopColor="#fff4d2" stopOpacity="0.9" />
            <stop offset="0.55" stopColor="#ffcb85" stopOpacity="0.42" />
            <stop offset="1" stopColor="#ffcb85" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${u}-hill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a1826" />
            <stop offset="1" stopColor="#180b12" />
          </linearGradient>
        </defs>
        <rect width="1000" height="625" fill={`url(#${u}-sky)`} />
        <circle cx="700" cy="252" r="240" fill={`url(#${u}-sun)`} />
        <circle cx="700" cy="252" r="90" fill="#ffe8bd" />
        <g fill="#5a1f2c" opacity="0.55">
          <ellipse className="art-cloud" cx="210" cy="146" rx="170" ry="13" />
          <ellipse className="art-cloud-slow" cx="520" cy="96" rx="118" ry="8" />
          <ellipse className="art-cloud-slow" cx="830" cy="188" rx="140" ry="10" />
        </g>
        <path d="M0 412 C170 348 320 400 470 386 C640 370 790 418 1000 372 L1000 625 L0 625 Z" fill={`url(#${u}-hill)`} />
        <path d="M0 492 C230 452 360 512 570 486 C770 462 890 508 1000 492 L1000 625 L0 625 Z" fill="#100810" />
        <g fill="none" stroke="#2b1119" strokeWidth="2.5" strokeLinecap="round" opacity="0.75">
          <path d="M286 178 q9 -8 18 0 q9 -8 18 0" />
          <path d="M352 146 q7 -6 14 0 q7 -6 14 0" />
          <path d="M236 214 q6 -5 12 0 q6 -5 12 0" />
        </g>
        <g className="art-breathe">{figure}</g>
        <Petals count={10} />
      </>
    )
  },

  neon: (u) => {
    const windows = (x: number, y: number, cols: number, rows: number, gapX: number, gapY: number) =>
      Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <rect
            key={`${r}-${c}`}
            x={x + c * gapX}
            y={y + r * gapY}
            width="20"
            height="28"
            opacity={0.14 + ((r + c) % 3) * 0.14}
          />
        )),
      )

    return (
      <>
        <defs>
          <linearGradient id={`${u}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#070a12" />
            <stop offset="0.6" stopColor="#131a2b" />
            <stop offset="1" stopColor="#251727" />
          </linearGradient>
          <linearGradient id={`${u}-wet`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff5a3c" stopOpacity="0.5" />
            <stop offset="1" stopColor="#ff5a3c" stopOpacity="0" />
          </linearGradient>
          <filter id={`${u}-blur`}>
            <feGaussianBlur stdDeviation="16" />
          </filter>
        </defs>
        <rect width="1000" height="625" fill={`url(#${u}-sky)`} />
        <g fill="#0c111d">
          <rect x="0" y="120" width="186" height="505" />
          <rect x="186" y="206" width="128" height="419" />
          <rect x="690" y="146" width="150" height="479" />
          <rect x="840" y="80" width="160" height="545" />
        </g>
        <g fill="#f7c778">{windows(18, 158, 3, 5, 46, 62)}</g>
        <g fill="#9fd8ef">{windows(708, 186, 2, 4, 54, 74)}</g>
        <g fill="#f7c778">{windows(862, 120, 2, 6, 56, 72)}</g>
        <ellipse cx="470" cy="500" rx="330" ry="130" fill="#ff3b2f" opacity="0.2" filter={`url(#${u}-blur)`} />

        <g className="art-flicker">
          <rect x="204" y="240" width="68" height="216" rx="3" fill="#150b10" stroke="#ff4b33" strokeWidth="2" />
          <g fill="#ff6b4a" fontFamily={JP_FONT} fontSize="29" textAnchor="middle">
            {['ラ', 'ー', 'メ', 'ン'].map((ch, i) => (
              <text key={i} x="238" y={278 + i * 40}>
                {ch}
              </text>
            ))}
          </g>
        </g>
        <g className="art-flicker-slow">
          <rect x="756" y="196" width="58" height="170" rx="3" fill="#0b1420" stroke="#74d8f2" strokeWidth="2" />
          <g fill="#8fe6ff" fontFamily={JP_FONT} fontSize="27" textAnchor="middle">
            {['酒', '場'].map((ch, i) => (
              <text key={i} x="785" y={248 + i * 46}>
                {ch}
              </text>
            ))}
          </g>
        </g>
        <g>
          <rect x="318" y="300" width="126" height="40" rx="2" fill="#1b0d14" stroke="#f3b544" strokeWidth="1.5" />
          <text x="381" y="328" fill="#f7c778" fontFamily={JP_FONT} fontSize="22" textAnchor="middle">
            喫茶
          </text>
        </g>
        {/* centre of frame: keeps the cut readable when cropped to a tall card */}
        <path d="M236 196 C420 214 640 214 800 198" stroke="#0a0f19" strokeWidth="4" fill="none" />
        <g className="art-flicker-slow">
          <rect x="386" y="238" width="228" height="56" rx="2" fill="#1c0a10" stroke="#ff5a3c" strokeWidth="2" />
          <text x="500" y="275" fill="#ffb08f" fontFamily={JP_FONT} fontSize="25" textAnchor="middle">
            居酒屋 六
          </text>
        </g>
        <g>
          <ellipse cx="452" cy="205" rx="15" ry="20" fill="#ff7a4a" className="art-flicker" />
          <ellipse cx="548" cy="205" rx="15" ry="20" fill="#ff7a4a" className="art-flicker-slow" />
          <path d="M452 185 L452 196 M548 185 L548 196" stroke="#0a0f19" strokeWidth="2" />
        </g>
        <ellipse cx="500" cy="420" rx="180" ry="80" fill="#ff5a3c" opacity="0.18" filter={`url(#${u}-blur)`} />
        <ellipse cx="238" cy="452" rx="90" ry="130" fill="#ff3b2f" opacity="0.16" filter={`url(#${u}-blur)`} />
        <ellipse cx="785" cy="420" rx="70" ry="110" fill="#74d8f2" opacity="0.14" filter={`url(#${u}-blur)`} />

        {/* figure under an umbrella, seen from behind */}
        <g fill="#080c15">
          <path d="M520 428 C556 356 682 356 720 428 C702 418 684 428 666 418 C646 430 626 418 608 430 C590 418 570 430 552 418 C538 428 528 424 520 428 Z" />
          <path d="M620 420 L620 470" stroke="#080c15" strokeWidth="4" />
          <circle cx="620" cy="452" r="12" />
          <path d="M620 464 L616 522" stroke="#080c15" strokeWidth="22" strokeLinecap="round" />
          <path d="M616 514 L604 560" stroke="#080c15" strokeWidth="9" strokeLinecap="round" />
          <path d="M616 514 L634 560" stroke="#080c15" strokeWidth="9" strokeLinecap="round" />
          <path d="M612 478 L596 506" stroke="#080c15" strokeWidth="7" strokeLinecap="round" />
        </g>

        <rect x="0" y="556" width="1000" height="69" fill={`url(#${u}-wet)`} opacity="0.55" />
        <g stroke="#ff7a55" strokeWidth="2" opacity="0.35" strokeLinecap="round">
          <line x1="200" y1="580" x2="292" y2="580" />
          <line x1="740" y1="590" x2="820" y2="590" />
          <line x1="470" y1="604" x2="540" y2="604" />
        </g>
        <Rain />
      </>
    )
  },

  rooftop: (u) => {
    const stars = Array.from({ length: 26 }).map((_, i) => (
      <circle
        key={i}
        cx={40 + ((i * 137) % 920)}
        cy={20 + ((i * 61) % 300)}
        r={i % 5 === 0 ? 2 : 1.1}
        fill="#fdf3d8"
        className="art-twinkle"
        style={{ animationDelay: `${(i * 0.31).toFixed(2)}s`, animationDuration: `${3 + (i % 4)}s` }}
      />
    ))
    const windows = Array.from({ length: 46 }).map((_, i) => (
      <rect
        key={i}
        x={30 + ((i * 71) % 940)}
        y={400 + ((i * 37) % 120)}
        width="7"
        height="10"
        opacity={0.2 + (i % 4) * 0.18}
      />
    ))

    return (
      <>
        <defs>
          <linearGradient id={`${u}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#080b18" />
            <stop offset="0.55" stopColor="#1d1832" />
            <stop offset="1" stopColor="#44263a" />
          </linearGradient>
          <radialGradient id={`${u}-moon`}>
            <stop offset="0" stopColor="#f7ebc8" stopOpacity="0.5" />
            <stop offset="1" stopColor="#f7ebc8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1000" height="625" fill={`url(#${u}-sky)`} />
        {stars}
        <circle cx="648" cy="146" r="150" fill={`url(#${u}-moon)`} />
        <circle cx="648" cy="146" r="62" fill="#f4e8c6" />
        <circle cx="624" cy="130" r="9" fill="#e4d5b0" opacity="0.7" />
        <circle cx="668" cy="168" r="12" fill="#e4d5b0" opacity="0.55" />
        <g fill="#2c2036" opacity="0.7">
          <ellipse className="art-cloud" cx="260" cy="120" rx="180" ry="12" />
          <ellipse className="art-cloud-slow" cx="640" cy="86" rx="150" ry="9" />
        </g>
        <g fill="#080a14">
          <rect x="0" y="352" width="120" height="273" />
          <rect x="130" y="404" width="90" height="221" />
          <rect x="240" y="372" width="70" height="253" />
          <rect x="330" y="430" width="110" height="195" />
          <rect x="560" y="392" width="96" height="233" />
          <rect x="676" y="356" width="120" height="269" />
          <rect x="812" y="410" width="80" height="215" />
          <rect x="900" y="366" width="100" height="259" />
        </g>
        <g fill="#ffd58a">{windows}</g>
        <g fill="none" stroke="#05060b" strokeWidth="1.6" opacity="0.9">
          <path d="M-20 210 C220 260 420 178 720 236 C850 262 940 250 1020 226" />
          <path d="M-20 250 C240 300 440 216 730 276" />
          <path d="M300 210 L300 206" />
        </g>
        {/* rooftop, seen from behind the figure */}
        <path d="M0 548 L1000 548 L1000 625 L0 625 Z" fill="#06070e" />
        <line x1="0" y1="548" x2="1000" y2="548" stroke="#1b2133" strokeWidth="3" />

        {/* figure standing at the rail, back view */}
        <g fill="#05060b">
          <ellipse cx="430" cy="364" rx="23" ry="26" />
          <path d="M424 388 L420 402 L440 402 L436 388 Z" />
          <path d="M406 404 C414 394 446 394 454 404 L460 498 L400 498 Z" />
          <path d="M410 416 L396 476" stroke="#05060b" strokeWidth="11" strokeLinecap="round" />
          <path d="M450 416 L464 476" stroke="#05060b" strokeWidth="11" strokeLinecap="round" />
          <path d="M418 494 L414 540" stroke="#05060b" strokeWidth="15" strokeLinecap="round" />
          <path d="M442 494 L446 540" stroke="#05060b" strokeWidth="15" strokeLinecap="round" />
        </g>

        {/* railing in front of the figure, for depth */}
        <g stroke="#151b2e" strokeWidth="3" opacity="0.95">
          <line x1="0" y1="468" x2="1000" y2="468" />
          <line x1="0" y1="502" x2="1000" y2="502" />
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={i} x1={20 + i * 74} y1="462" x2={20 + i * 74} y2="504" strokeWidth="2.5" />
          ))}
        </g>
      </>
    )
  },

  run: (u) => {
    const runner = (
      <g>
        <circle cx="540" cy="228" r="30" fill="#14110f" />
        <path d="M520 262 L492 348" stroke="#e8452f" strokeWidth="48" strokeLinecap="round" />
        <path d="M528 266 L476 300" stroke="#14110f" strokeWidth="21" strokeLinecap="round" />
        <path d="M536 268 L596 296 L632 262" stroke="#14110f" strokeWidth="21" strokeLinecap="round" fill="none" />
        <path d="M494 344 L566 388 L580 462" stroke="#14110f" strokeWidth="32" strokeLinecap="round" fill="none" />
        <path d="M494 344 L424 398 L398 468" stroke="#14110f" strokeWidth="32" strokeLinecap="round" fill="none" />
        <path d="M566 228 C540 214 516 224 508 242 C520 236 534 238 542 246 Z" fill="#14110f" />
      </g>
    )

    return (
      <>
        <defs>
          <linearGradient id={`${u}-bg`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6edde" />
            <stop offset="1" stopColor="#e6d3bb" />
          </linearGradient>
        </defs>
        <rect width="1000" height="625" fill={`url(#${u}-bg)`} />
        <circle cx="560" cy="300" r="210" fill="#e8452f" opacity="0.12" />
        <g stroke="#1b1a18" strokeWidth="2" opacity="0.22" strokeLinecap="round">
          {Array.from({ length: 16 }).map((_, i) => (
            <line
              key={i}
              x1={-80 + ((i * 71) % 700)}
              y1={60 + ((i * 83) % 480)}
              x2={40 + ((i * 71) % 700)}
              y2={60 + ((i * 83) % 480)}
              className="art-speed"
              style={{ animationDelay: `${((i * 0.09) % 1.5).toFixed(2)}s` }}
            />
          ))}
        </g>
        <ellipse cx="500" cy="512" rx="230" ry="16" fill="#c9ab8a" opacity="0.5" />
        <g opacity="0.14" transform="translate(-60 6)">
          {runner}
        </g>
        <g opacity="0.22" transform="translate(-30 3)">
          {runner}
        </g>
        <g>{runner}</g>
        <g fill="#c9ab8a">
          {Array.from({ length: 6 }).map((_, i) => (
            <circle
              key={i}
              cx={380 - i * 14}
              cy={498 + (i % 2) * 10}
              r={10 + i * 2}
              className="art-puff"
              style={{ animationDelay: `${(i * 0.24).toFixed(2)}s` }}
            />
          ))}
        </g>
        <g fill="none" stroke="#1b1a18" strokeWidth="2" opacity="0.5">
          <path d="M660 180 q24 -18 48 0 q24 -18 48 0" strokeLinecap="round" />
        </g>
      </>
    )
  },

  sky: (u) => (
    <>
      <defs>
        <linearGradient id={`${u}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4f8fc4" />
          <stop offset="0.45" stopColor="#8fc0da" />
          <stop offset="0.78" stopColor="#e9dcc0" />
          <stop offset="1" stopColor="#f6e6c6" />
        </linearGradient>
        <filter id={`${u}-soft`}>
          <feGaussianBlur stdDeviation="16" />
        </filter>
        <linearGradient id={`${u}-water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fb9cc" />
          <stop offset="1" stopColor="#d9c8a8" />
        </linearGradient>
      </defs>
      <rect width="1000" height="625" fill={`url(#${u}-sky)`} />
      <circle cx="780" cy="470" r="120" fill="#fff3d6" opacity="0.75" filter={`url(#${u}-soft)`} />
      <g fill="#fdfaf2" opacity="0.9" filter={`url(#${u}-soft)`}>
        <ellipse className="art-cloud-slow" cx="220" cy="180" rx="190" ry="46" />
        <ellipse className="art-cloud" cx="560" cy="128" rx="150" ry="34" />
        <ellipse className="art-cloud-slow" cx="760" cy="230" rx="170" ry="30" />
        <ellipse className="art-cloud" cx="360" cy="300" rx="220" ry="26" opacity="0.6" />
      </g>
      <g fill="#cfd9dc" opacity="0.55" filter={`url(#${u}-soft)`}>
        <ellipse className="art-cloud" cx="140" cy="360" rx="180" ry="22" />
        <ellipse className="art-cloud-slow" cx="620" cy="386" rx="240" ry="20" />
      </g>
      <rect x="0" y="500" width="1000" height="125" fill={`url(#${u}-water)`} />
      <g stroke="#fdf6e4" strokeWidth="2" opacity="0.6">
        <line x1="200" y1="524" x2="320" y2="524" />
        <line x1="540" y1="546" x2="660" y2="546" />
        <line x1="330" y1="572" x2="470" y2="572" />
        <line x1="700" y1="588" x2="830" y2="588" />
      </g>
      <g fill="none" stroke="#2b2a2a" strokeWidth="2.6" strokeLinecap="round" opacity="0.75">
        <path d="M300 388 q10 -9 20 0 q10 -9 20 0" />
        <path d="M354 362 q8 -7 16 0 q8 -7 16 0" />
        <path d="M262 350 q7 -6 14 0 q7 -6 14 0" />
        <path d="M392 408 q6 -5 12 0 q6 -5 12 0" />
      </g>
      <g transform="translate(180 300) rotate(-6)" fill="#3a3a3a">
        <path d="M0 0 L44 6 L0 12 Z" />
        <path d="M6 2 L-2 -10 L8 4 Z" />
        <path d="M-4 10 L-12 20 L6 10 Z" />
      </g>
      <path d="M0 300 C160 290 240 306 300 298" stroke="#fdfaf2" strokeWidth="3" opacity="0.4" fill="none" />
    </>
  ),

  model: () => {
    const face = (
      <g>
        <path
          d="M292 292 C288 240 312 204 348 198 C388 192 416 220 414 260 C412 296 396 320 372 330 C348 340 314 336 300 320 C294 312 292 302 292 292 Z"
          fill="none"
          stroke="#1b1a18"
          strokeWidth="3"
        />
        <path
          d="M288 288 C282 232 310 190 352 188 C402 186 424 216 418 258 C406 230 382 214 352 216 C318 218 296 246 292 284 Z"
          fill="#1b1a18"
        />
        <g stroke="#1b1a18" strokeWidth="3" strokeLinecap="round">
          <line x1="318" y1="286" x2="336" y2="284" />
          <line x1="366" y1="284" x2="384" y2="282" />
          <line x1="320" y1="268" x2="338" y2="266" strokeWidth="2" />
          <line x1="368" y1="266" x2="386" y2="264" strokeWidth="2" />
          <line x1="352" y1="288" x2="350" y2="302" strokeWidth="2" />
          <line x1="340" y1="316" x2="358" y2="314" strokeWidth="2" />
        </g>
        <path d="M332 336 L328 372" stroke="#1b1a18" strokeWidth="3" />
        <path d="M370 334 L376 372" stroke="#1b1a18" strokeWidth="3" />
        <path d="M262 500 C266 424 298 386 340 372 C388 384 428 424 434 500" fill="none" stroke="#1b1a18" strokeWidth="3" />
        <path d="M340 372 C326 396 322 430 322 470" fill="none" stroke="#1b1a18" strokeWidth="2.4" />
        <path d="M376 372 C388 396 392 430 394 470" fill="none" stroke="#1b1a18" strokeWidth="2.4" />
      </g>
    )
    return (
      <>
        <rect width="1000" height="625" fill="#efe9dd" />
        <g stroke="#dcd2bf" strokeWidth="1">
          {Array.from({ length: 21 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="625" />
          ))}
          {Array.from({ length: 13 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} />
          ))}
        </g>
        <g fontFamily="ui-monospace, monospace" fill="#1b1a18">
          <text x="42" y="70" fontSize="11" letterSpacing="3.4">
            MODEL SHEET / 001
          </text>
          <text x="42" y="100" fontSize="11" letterSpacing="3.4" fill="#a13a2a">
            CHARACTER DESIGN — KAEDE
          </text>
        </g>
        <g fill="#1b1a18" style={{ fontFamily: 'var(--font-jp)' }}>
          <text x="42" y="132" fontSize="26">
            カエデ
          </text>
        </g>
        <g stroke="#a13a2a" strokeWidth="1.4" strokeDasharray="6 6" fill="none" className="art-dash">
          <circle cx="352" cy="266" r="146" />
          <line x1="352" y1="60" x2="352" y2="520" />
        </g>
        <g fontFamily="ui-monospace, monospace" fill="#a13a2a" fontSize="9" letterSpacing="2">
          <text x="360" y="102">
            EYE LINE
          </text>
          <text x="150" y="470">
            158 cm
          </text>
          <text x="500" y="470">
            6.5 HEADS
          </text>
        </g>
        {face}

        {/* back view */}
        <g transform="translate(560 20) scale(0.9)" fill="none" stroke="#1b1a18" strokeWidth="3">
          <circle cx="140" cy="240" r="62" />
          <path d="M78 240 C78 174 202 174 202 240 C202 300 170 336 140 336 C110 336 78 300 78 240 Z" fill="#1b1a18" />
          <path d="M140 336 L138 386" />
          <path d="M52 500 C58 424 92 392 140 382 C188 392 222 424 228 500" />
          <path d="M140 382 L140 500" strokeWidth="2" />
        </g>

        {/* expression thumbnails */}
        <g fontFamily="ui-monospace, monospace" fill="#1b1a18" fontSize="9" letterSpacing="2">
          <text x="640" y="470">
            EXPRESSIONS
          </text>
        </g>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${648 + i * 84} ${512})`}>
            <circle cx="0" cy="0" r="26" fill="none" stroke="#1b1a18" strokeWidth="2.4" />
            <path
              d={
                i === 0
                  ? 'M-26 -6 C-26 -34 26 -34 26 -6 C14 -22 -14 -22 -26 -6 Z'
                  : i === 1
                    ? 'M-26 -2 C-30 -34 30 -38 26 -2 C16 -24 -18 -22 -26 -2 Z'
                    : 'M-26 -8 C-24 -36 28 -32 26 -8 C18 -26 -8 -26 -26 -8 Z'
              }
              fill="#1b1a18"
            />
            <circle cx="-9" cy="2" r="2.4" fill="#1b1a18" />
            <circle cx="9" cy="2" r="2.4" fill="#1b1a18" />
            <line x1="-6" y1="16" x2="6" y2="16" stroke="#1b1a18" strokeWidth="2" strokeLinecap="round" />
          </g>
        ))}

        {/* colour swatches */}
        <g>
          <text x="42" y="560" fontFamily="ui-monospace, monospace" fill="#1b1a18" fontSize="9" letterSpacing="2">
            COLOUR
          </text>
          {['#1b1a18', '#e8dcc6', '#c4553f', '#7c8a7a', '#3c4a5a'].map((c, i) => (
            <rect key={c} x={42 + i * 34} y="572" width="26" height="26" fill={c} stroke="#1b1a18" strokeWidth="0.8" />
          ))}
        </g>
      </>
    )
  },

  portrait: (u) => (
    <>
      <defs>
        <linearGradient id={`${u}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4ecdd" />
          <stop offset="1" stopColor="#e8dcc7" />
        </linearGradient>
        <linearGradient id={`${u}-sun`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff6a4a" />
          <stop offset="1" stopColor="#d33a28" />
        </linearGradient>
      </defs>
      <rect width="1000" height="625" fill={`url(#${u}-bg)`} />
      <circle cx="500" cy="300" r="240" fill={`url(#${u}-sun)`} />
      <g stroke="#1b1a18" strokeWidth="1" strokeDasharray="5 7" opacity="0.4" className="art-dash">
        <circle cx="500" cy="300" r="284" fill="none" />
      </g>
      <g fill="#120e12">
        <path d="M250 625 C258 520 320 470 400 452 C440 442 470 440 500 440 C570 440 640 468 690 518 C726 554 744 590 750 625 Z" />
        <path d="M466 430 L466 486 L534 486 L534 430 Z" />
        <ellipse cx="500" cy="378" rx="92" ry="104" />
        <circle cx="562" cy="312" r="46" />
        <path d="M406 376 C400 300 438 254 500 252 C564 250 598 300 594 376 C584 330 558 300 518 296 C470 292 426 322 406 376 Z" />
      </g>
      <path d="M410 384 C408 322 448 282 500 278" stroke="#f3b544" strokeWidth="3" fill="none" opacity="0.85" />
      <path d="M596 350 C620 372 630 398 632 420" stroke="#f3b544" strokeWidth="2" fill="none" opacity="0.5" />
      <Petals count={7} seed={2} />
    </>
  ),
}
