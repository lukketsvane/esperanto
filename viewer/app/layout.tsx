import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Esperanto Study Data Viewer',
  description: 'Interactive viewer for Esperanto study ChatGPT conversation dataset',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
