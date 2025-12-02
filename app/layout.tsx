import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PageLoader from "@/components/PageLoader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trade Aviator | Automated Trading System",
  description: "Skip the Learning Curve. A Ready To Use Automated Trading System.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PageLoader />
        {children}
      </body>
    </html>
  );
}
