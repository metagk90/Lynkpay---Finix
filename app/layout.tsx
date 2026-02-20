import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'

import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta' })

export const metadata: Metadata = {
  title: 'LYNKPAY Dashboard',
  description: 'Creator dashboard for managing links, digital products, and earnings',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
