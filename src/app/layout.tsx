import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import GrainOverlay from "@/components/GrainOverlay";
import VisitorGlobe from "@/components/visitor-globe/VisitorGlobeLoader";
import WireMeshEasterEgg from "@/components/EasterEgg/WireMeshEasterEggLoader";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Colin Roberts — UX Researcher",
  description: "UX Researcher & HCI graduate studying behavior, designing for it.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oswald.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-cream text-body antialiased">
        <GrainOverlay />
        {children}
        <VisitorGlobe />
        <WireMeshEasterEgg />
      </body>
    </html>
  );
}
