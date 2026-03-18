import type { Metadata } from "next";
import { Inter, Sarabun } from "next/font/google";
import "./globals.css";
import { ToastProvider, ToastViewport } from "@/components/ui/Toast";
import { Toaster as SonnerToaster } from "@/components/ui/Sonner";
import Script from "next/script";

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
  title: "Windflu - พลังแห่งการจัดการไวรัลคอนเทนต์",
  description: "Windflu แพลตฟอร์มการตลาดคลิปสั้น",
};

import QueryProvider from "@/components/QueryProvider";

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
        <QueryProvider>
          <ToastProvider>
            {children}
            <ToastViewport />
            <SonnerToaster position="top-right" richColors />
          </ToastProvider>
        </QueryProvider>
        <Script src="https://cdn.omise.co/omise.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}

