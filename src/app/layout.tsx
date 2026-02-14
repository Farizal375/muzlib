import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

// 1. Setup Font Inter
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
    // 2. Kustomisasi Tampilan Clerk di sini
    <ClerkProvider
      appearance={{
        layout: {
          socialButtonsPlacement: "bottom", // Pindahkan tombol Google ke bawah form
          socialButtonsVariant: "blockButton", // Tampilan tombol Google penuh
          unsafe_disableDevelopmentModeWarnings: true,
        },
        variables: {
          colorPrimary: "#2563eb", // Blue-600 (Warna Brand MuzLib)
          colorText: "#1e293b", // Slate-800
          colorBackground: "#ffffff",
          colorInputBackground: "#f8fafc", // Slate-50
          colorInputText: "#0f172a", // Slate-900
          borderRadius: "0.5rem",
          fontFamily: inter.style.fontFamily, // Gunakan font yang sama dengan App
        },
        elements: {
          // Kustomisasi detail elemen menggunakan Tailwind CSS
          card: "shadow-xl border border-slate-200 rounded-xl",
          headerTitle: "text-2xl font-bold text-slate-900",
          headerSubtitle: "text-slate-500",
          socialButtonsBlockButton: 
            "bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium",
          socialButtonsBlockButtonText: "font-semibold",
          formButtonPrimary: 
            "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 transition-all",
          formFieldInput: 
            "border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg",
          footerActionLink: "text-blue-600 hover:text-blue-700 font-semibold",
        },
      }}
    >
      <html lang="id">
        <body className={`${inter.className} antialiased`} suppressHydrationWarning={true}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}