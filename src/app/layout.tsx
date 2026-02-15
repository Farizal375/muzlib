import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { ReadingListDrawer } from "@/components/features/reading-list-drawer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MuzLib - Perpustakaan Digital",
  description: "Platform peminjaman dan manajemen buku modern.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // --- AMBIL DATA ROLE USER DI SINI ---
  const { userId } = await auth();
  let userRole = null;

  if (userId) {
    // Cek database, tapi gunakan try-catch agar tidak error jika DB belum sync
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });
      userRole = user?.role;
    } catch (error) {
      console.error("Layout: Gagal ambil role", error);
    }
  }
  

  return (
    <ClerkProvider>
      <html lang="id">
        <body 
          className={`${inter.className} flex flex-col min-h-screen`}
          suppressHydrationWarning={true}
        >
          {/* Kirim userRole ke Navbar */}
          <Navbar userRole={userRole} />
          <ReadingListDrawer /> 

          <main className="flex-1 bg-slate-50">
            {children}
          </main>

          <Footer />
          <Toaster />
          
        </body>
      </html>
    </ClerkProvider>
  );
}