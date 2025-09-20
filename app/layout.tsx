import type React from "react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Poppins, Crimson_Text, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/lib/toast";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  variable: "--font-crimson-text",
  weight: ["400", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StoryBuds - Every story deserves to be told",
  description:
    "Premium AI-powered storytelling app that helps you create, listen to, and share heart-touching stories",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${poppins.variable} ${crimsonText.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="warm"
          enableSystem
          themes={[
            "light",
            "dark",
            "warm",
            "ocean",
            "forest",
            "sunset",
            "midnight",
            "dreamland",
            "galaxy",
            "paper",
            "candyland",
            "icecream",
            "rainbow",
            "fairytale",
            "space",
            "mint",
          ]}
        >
          <ToastProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </ToastProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
