import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'

import { site } from '../../data/site'
import { cx } from '../lib/cx'

export function useLocalTime() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: site.timezone,
        }).format(new Date()),
      )
    tick()
    const id = window.setInterval(tick, 15_000)
    return () => window.clearInterval(id)
  }, [])
  return time
}

export function Nav() {
  const time = useLocalTime()
  const location = useLocation()
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > last && y > 140)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const link = (to: string, label: string, jp: string) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        cx(
          'link-draw flex items-baseline gap-1.5 text-[13px] transition-colors',
          isActive || (to !== '/' && location.pathname.startsWith(to))
            ? 'text-fg'
            : 'text-muted hover:text-fg',
        )
      }
    >
      {label}
      <span className="font-jp hidden text-[9.5px] text-faint sm:inline">{jp}</span>
    </NavLink>
  )

  return (
    <header
      className={cx(
        'fixed inset-x-0 top-0 z-40 bg-bg/70 backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        hidden && '-translate-y-full',
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-5 sm:px-8">
        <Link to="/" className="group flex items-baseline gap-2">
          <span className="font-display text-[20px] leading-none">{site.navName}</span>
          <span className="font-jp text-[9.5px] text-accent">原画</span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-7">
          {link('/#work', 'Work', '作品')}
          {link('/about', 'About', '略歴')}
          <Link to="/#contact" className="link-draw flex items-baseline gap-1.5 text-[13px] text-muted transition-colors hover:text-fg">
            Contact
            <span className="font-jp hidden text-[9.5px] text-faint sm:inline">連絡</span>
          </Link>
          <span className="hidden items-center gap-2 md:flex">
            <span className="size-1.5 rounded-full bg-accent" />
            <span className="eyebrow text-faint">
              {site.location} {time}
            </span>
          </span>
        </nav>
      </div>
      <div className="h-px bg-line" />
    </header>
  )
}
