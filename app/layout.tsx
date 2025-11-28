import type React from "react"
import type { Metadata } from "next"
import { Orbitron } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/layout/navigation"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { LiveAPIProvider } from "@/contexts/live-api-context"

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
})

export const metadata: Metadata = {
  title: "ArogyaSetu - AI-Powered Medical Consultation Platform",
  description: "Get instant medical guidance from our AI doctor. ArogyaSetu connects patients with intelligent medical consultation and health reporting",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY || ""

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${orbitron.variable} font-orbitron antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <LiveAPIProvider apiKey={apiKey}>
              <Navigation />
              <main>{children}</main>
            </LiveAPIProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}