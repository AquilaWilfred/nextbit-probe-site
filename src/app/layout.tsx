import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SITE_META, CONTACT_INFO } from "@/constants";

// 1. Optimize Fonts: Inter for UI, JetBrains Mono for Hardware/Report data
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const viewport: Viewport = {
  themeColor: "#000000", // Matches a "Dark Mode" forensic aesthetic
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(CONTACT_INFO.url),
  icons: {
    icon: "/NextBitProbe_logo.png",
  },
  title: { 
    default: `${SITE_META.name} — High-Fidelity Hardware, OS and Firmware Forensic & Audit tool`, 
    template: `%s | ${SITE_META.name}` 
  },
  description: SITE_META.description,
  keywords: [
    "Hardware Diagnostics", "System Audit", "Firmware Forensic", "NextBit Probe", 
    "IT Technician Tools", "System Intelligence", "Hardware Telemetry", 
    "Forensic Analysis", "System Scanning", "Probe Reports", "System Insights",
    "Developed by Aquila Amon Wilfred", "NextBit Probe by Aquila Amon Wilfred", 
    "Probe by Aquila Amon Wilfred", "NextBit Probe Tool", "Probe Tool"
  ],
  authors: [{ name: "Aquila Amon Wilfred", url: "https://eaglewills.vercel.app" }],
  creator: "NextBit",
  openGraph: {
    title: SITE_META.name,
    description: SITE_META.description,
    url: CONTACT_INFO.url,
    siteName: SITE_META.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png", // Ensure this exists in your public folder
        width: 1200,
        height: 630,
        alt: "NextBit Probe Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_META.name,
    description: SITE_META.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        {/* main gets flex-grow to push footer down on short pages */}
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}