import type { Metadata } from "next";
import { Inter, Sarabun } from "next/font/google";
import "./globals.css";
import { ToastProvider, ToastViewport } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sarabun",
});

export const metadata: Metadata = {
  title: "Windflow - พลังแห่งการจัดการไวรัลคอนเทนต์",
  description: "Next.js + Supabase + Radix UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${sarabun.variable} ${sarabun.className} min-h-screen bg-zinc-50/50 antialiased`}
      >
        <ToastProvider>
          {children}
          <ToastViewport />
        </ToastProvider>
      </body>
    </html>
  );
}
