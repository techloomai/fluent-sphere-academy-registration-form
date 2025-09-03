import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Fluent Sphere Academy - A Global Space for Fluency",
  description:
    "Join Fluent Sphere Academy, the premier English language learning institution. Master English with expert instructors, flexible schedules, and proven teaching methods. Register now for our comprehensive English courses.",
  keywords:
    "English learning, language academy, English courses, fluency training, English classes, language school, IELTS preparation, spoken English, grammar courses",
  authors: [{ name: "Fluent Sphere Academy" }],
  creator: "Fluent Sphere Academy",
  publisher: "Fluent Sphere Academy",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fluentsphere.academy",
    siteName: "Fluent Sphere Academy",
    title: "Fluent Sphere Academy - A Global Space for Fluency",
    description:
      "Master English with Fluent Sphere Academy. Expert instructors, flexible schedules, and proven teaching methods. Register now for comprehensive English courses.",
    images: [
      {
        url: "/images/fluent-sphere-logo.jpg",
        width: 1200,
        height: 630,
        alt: "Fluent Sphere Academy Logo",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@fluentsphere",
    creator: "@fluentsphere",
    title: "Fluent Sphere Academy - A Global Space for Fluency",
    description: "Master English with expert instructors and proven teaching methods. Register now!",
    images: ["/images/fluent-sphere-logo.jpg"],
  },
  icons: {
    icon: [
      { url: "/images/fluent-sphere-logo.jpg", sizes: "32x32", type: "image/jpeg" },
      { url: "/images/fluent-sphere-logo.jpg", sizes: "16x16", type: "image/jpeg" },
    ],
    apple: [{ url: "/images/fluent-sphere-logo.jpg", sizes: "180x180", type: "image/jpeg" }],
    shortcut: "/images/fluent-sphere-logo.jpg",
  },
  manifest: "/manifest.json",
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://fluentsphere.academy",
  },
  category: "Education",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
