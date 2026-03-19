import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono, Crimson_Pro } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import SplashCursor from "@/components/animations/SplashCursor";
import BlobCursor from "@/components/animations/BlobCursor";
import LiquidEther from "@/components/animations/LiquidEther";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const crimsonPro = Crimson_Pro({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Quiet Dissent | Strategic Advisor & AI Consultant for Nashville Businesses",
  description:
    "Quiet Dissent is Nashville's operations-first AI consultancy. We assess your business, build a roadmap, implement the right systems, and stay as your ongoing strategic partner — at a fraction of enterprise cost.",
  openGraph: {
    title: "Quiet Dissent | Strategic Advisor & AI Consultant for Nashville Businesses",
    description:
      "Quiet Dissent is Nashville's operations-first AI consultancy. We assess your business, build a roadmap, implement the right systems, and stay as your ongoing strategic partner — at a fraction of enterprise cost.",
    type: "website",
    siteName: "Quiet Dissent",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiet Dissent",
    description: "Nashville's operations-first AI consultancy.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable} ${crimsonPro.variable}`}
      >
        <a
          href="#main"
          style={{
            position: "absolute",
            left: "-9999px",
            top: "auto",
            width: "1px",
            height: "1px",
            overflow: "hidden",
          }}
        >
          Skip to main content
        </a>
        <SmoothScroll>
          <LiquidEther />
          {children}
          <BlobCursor />
          <SplashCursor />
        </SmoothScroll>
      </body>
    </html>
  );
}
