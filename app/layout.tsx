import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/components/shared/Toast'

export const metadata: Metadata = {
  title: 'Lagos CMB - Citizens Mediation Bureau',
  description: 'Free dispute resolution services for Lagos State residents',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif" }}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
