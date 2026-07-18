import type { Metadata, Viewport } from 'next'
import './globals.css'

const siteUrl = 'https://watasiwa-art.github.io/'
const title = 'Watashiwa Art — The Digital Museum of Animation & Anime'
const description =
  'A premium educational museum dedicated to the art, history and craft of animation and Japanese anime.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Watashiwa Art',
    title,
    description,
    images: [{ url: '/assets/images/og-cover.jpg', width: 1200, height: 630, alt: 'Watashiwa Art digital animation museum' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/assets/images/og-cover.jpg'],
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: '/assets/icons/favicon.svg',
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#05070a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="antialiased" style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}
