import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { SeedProvider } from '@/components/seed-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { TourProvider } from '@/components/tour/tour-provider'
import { TourTooltip } from '@/components/tour/tour-tooltip'

export const metadata: Metadata = {
  title: 'CareCircle - Cancer Support Portal',
  description: 'A private, secure space for cancer patients to share daily updates and coordinate support from loved ones.',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TourProvider>
            <SeedProvider>
              {children}
            </SeedProvider>
            <TourTooltip />
          </TourProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
