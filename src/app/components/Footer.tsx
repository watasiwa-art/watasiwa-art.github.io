import { ArrowUpRight } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { site } from '../../data/site'
import { Lines, Magnetic, Reveal } from './motion'
import { useLocalTime } from './Nav'

export function Footer() {
  const time = useLocalTime()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  async function submit(e: FormEvent) {
    e.preventDefault()
    setState('sending')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (response.ok) {
        setState('done')
      } else {
        setState('error')
        const data = (await response.json().catch(() => null)) as { error?: string } | null
        setError(data?.error ?? 'Something went wrong.')
      }
    } catch {
      // Static hosting (e.g. GitHub Pages) has no /api/contact endpoint.
      setState('error')
      setError(`Couldn’t send from this page — email ${site.email} instead.`)
    }
  }

  const field =
    'h-14 w-full border border-line-strong bg-transparent px-4 text-[15px] placeholder:text-faint transition-colors focus:border-accent focus:outline-none'

  return (
    <footer id="contact" className="mt-28 scroll-mt-20 border-t border-line sm:mt-40">
      <div className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-4">
          <p className="eyebrow text-accent">Contact / 連絡</p>
          <p className="eyebrow text-faint">
            {site.available ? site.availability : 'Not taking new work'}
          </p>
        </div>

        <div className="mt-10 grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
          <div>
            <Lines
              as="h2"
              className="font-display text-[clamp(44px,7.4vw,110px)]"
              lines={['Let’s draw', <>something <span className="text-accent">moving</span></>]}
            />
            <p className="font-jp mt-5 text-[13px] text-muted">お仕事のご相談はこちらまで</p>
            <Reveal delay={0.2} className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              <Magnetic>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex h-14 items-center gap-2 bg-fg px-7 text-[15px] font-medium text-bg transition-colors hover:bg-accent hover:text-white"
                >
                  {site.email}
                  <ArrowUpRight className="size-4" />
                </a>
              </Magnetic>
              <p className="max-w-[28ch] text-[13px] leading-relaxed text-muted">
                Replies within two days, in English or Japanese. Test cuts welcome.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            {state === 'done' ? (
              <div className="flex h-full min-h-[300px] flex-col justify-center border border-line bg-surface p-8">
                <p className="font-jp text-[12px] text-accent">ありがとうございます</p>
                <p className="font-display mt-3 text-[38px]">Thank you</p>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">
                  I read everything myself and reply within two days.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    required
                    placeholder="Your name"
                    className={field}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    className={field}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <textarea
                  required
                  placeholder="Studio, production, or the cut you have in mind"
                  className={`${field} h-auto min-h-[150px] resize-none py-4`}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
                <button
                  type="submit"
                  disabled={state === 'sending'}
                  className="group flex h-14 items-center justify-between border border-fg px-6 text-[15px] font-medium transition-colors hover:bg-fg hover:text-bg disabled:opacity-50"
                >
                  {state === 'sending' ? 'Sending…' : 'Send'}
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
                </button>
                {state === 'error' && <p className="text-[13px] text-accent">{error}</p>}
              </form>
            )}
          </Reveal>
        </div>

        <div className="mt-20 grid gap-6 border-t border-line pt-6 text-[13px] sm:grid-cols-3">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="link-draw text-muted transition-colors hover:text-fg">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="eyebrow text-faint sm:text-center">
            {site.location}, {time}
          </p>
          <p className="eyebrow text-faint sm:text-right">
            © {new Date().getFullYear()} {site.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
