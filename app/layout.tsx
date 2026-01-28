import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AutoLead AI - Transform Visitors into Leads',
  description: 'AI-powered lead capture and WhatsApp delivery system for businesses',
  keywords: 'lead capture, AI chatbot, WhatsApp automation, business leads',
  authors: [{ name: 'AutoLead AI Team' }],
  openGraph: {
    title: 'AutoLead AI - Transform Visitors into Leads',
    description: 'AI-powered lead capture and WhatsApp delivery system for businesses',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}