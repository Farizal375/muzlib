import type { Metadata } from "next";
import { Inter } from "next/font/google"; // <--- Kita pakai Google Font
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

// Konfigurasi Font Inter (Otomatis download, tidak butuh file lokal)
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MuzLib",
  description: "Perpustakaan Digital Modern",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="id">
        {/* Masukkan class font Inter ke body */}
        <body className={`${inter.className} antialiased`} suppressHydrationWarning={true}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}