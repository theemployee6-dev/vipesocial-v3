import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

// Fonte display — usada em títulos, logo e botões principais.
// O variable permite usar via CSS var(--font-syne).
// weight 400 a 800 cobre todos os usos da vipeSocial.
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Fonte body — usada em textos, labels e inputs.
// italic: true porque usamos itálico em alguns textos de apoio.
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "vipeSocial — IA para criadores TikTok",
  description:
    "Descubra por que seus vídeos viralizam e receba roteiros personalizados para a sua realidade.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // lang="pt-BR" porque a vipeSocial é uma plataforma brasileira.
    // Isso afeta acessibilidade e SEO.
    <html lang="pt-BR">
      <body className={`${syne.variable} ${dmSans.variable} antialiased`}>
        {children}
        <Toaster position="top-center" richColors theme="dark" />
      </body>
    </html>
  );
}
