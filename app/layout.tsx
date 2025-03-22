import type React from "react"
import "./globals.css"
import { Montserrat, Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

// Premium, modern font for headings
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["700", "800", "900"],
})

// Clean, modern font for body text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
})

export const metadata = {
  title: "Innovare - Lanza tu Marketplace en 30 días",
  description: "Crea tu marketplace rentable con tráfico orgánico y monetización desde el día 1"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${montserrat.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="bg-black">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'