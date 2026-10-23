import type { Metadata, Viewport } from "next";
import "../styles/globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileQuickBar } from "@/components/MobileQuickBar";

export const metadata: Metadata = {
  title: "INOVA SAÚDE 2026 · Inscrições e Credenciamento",
  description:
    "Transforme uma dor real da saúde em solução. Hackathon e maratona de inovação em saúde da Universidade Positivo e ecohub.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0B4279" },
    { media: "(prefers-color-scheme: dark)", color: "#061320" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://www.youtube-nocookie.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=Mulish:wght@600;700;800;900&display=swap"
        />
      </head>
      <body className="min-h-screen min-h-[100dvh] w-full max-w-full overflow-x-hidden flex flex-col antialiased">
        <Header />
        <main className="flex-1 w-full max-w-full min-w-0 flex flex-col pb-20 md:pb-0">{children}</main>
        <MobileQuickBar />
        <Footer />
      </body>
    </html>
  );
}
