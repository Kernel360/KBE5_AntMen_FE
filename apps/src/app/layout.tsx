import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
//import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AntMen",
  description: "AntMen Frontend Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>
          <main className="min-h-screen max-w-[370px] mx-auto bg-white">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
} 