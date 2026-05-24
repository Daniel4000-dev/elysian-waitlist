import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sfpro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Elysian — A Study in Modern Form",
  description: "Defined by silence. Presence before attention. Join the Elysian waitlist.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
