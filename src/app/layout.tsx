import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Manrope, DM_Mono } from "next/font/google";
import SideNavRail from "@/components/layout/SideNavRail";
import CyberTerminal from "@/components/ui/CyberTerminal";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#06100b",
};

export const metadata: Metadata = {
  title: {
    default: "Vyuham '26 | The Future Awaits",
    template: "%s | Vyuham '26",
  },
  description:
    "Vyuham 26 — Digital University Kerala's national-level techno-cultural fest. Three days of technology, culture, gaming, and impact at Technocity, Thiruvananthapuram.",
  keywords: [
    "Vyuham",
    "DUK",
    "Digital University Kerala",
    "techno-cultural fest",
    "hackathon",
    "college fest",
    "2026",
    "Technocity",
    "Thiruvananthapuram",
  ],
  metadataBase: new URL("https://vyuham.duk.ac.in"),
  openGraph: {
    title: "Vyuham '26 | The Future Awaits",
    description:
      "A national-level techno-cultural convergence for the curious, the bold and the people building what is next.",
    siteName: "Vyuham '26",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vyuham '26 | The Future Awaits",
    description:
      "A national-level techno-cultural convergence for the curious, the bold and the people building what is next.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${manrope.variable} ${dmMono.variable}`}
    >
      <body>
        {/* Noise texture overlay */}
        <div className="noise-overlay" aria-hidden="true" />

        {/* Global side navigation */}
        <SideNavRail />

        {/* Global Cyber Terminal Console */}
        <CyberTerminal />

        {/* Site shell */}
        <div className="relative z-0 flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
