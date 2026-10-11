import type { Metadata, Viewport } from "next";
import { Onest, Young_Serif, Tiro_Devanagari_Hindi } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { MotionProvider } from "@/components/MotionProvider";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
});

const youngSerif = Young_Serif({
  variable: "--font-young-serif",
  subsets: ["latin"],
  weight: "400",
});

const tiroDevanagari = Tiro_Devanagari_Hindi({
  variable: "--font-tiro-devanagari",
  subsets: ["devanagari", "latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "AapnoKhet | Kitchen staples, direct from our warehouse",
  description:
    "Stone-milled atta, aged basmati, unpolished dals and cold-chain dairy for restaurants, hotels and caterers. Lab-tested batches, delivery by 6 AM, 15-day credit and GST invoices.",
};

export const viewport: Viewport = {
  colorScheme: "only light",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${onest.variable} ${youngSerif.variable} ${tiroDevanagari.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CartProvider>
            <MotionProvider>{children}</MotionProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
