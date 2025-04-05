import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: ' Gitverse App',
  description: 'Created with next',
  generator: 'pranaydev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
