import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/app/providers"

import '@rainbow-me/rainbowkit/styles.css'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TUM Blockchain Internal Course App",
  description: "Application for TUM Blockchain Internal course",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
