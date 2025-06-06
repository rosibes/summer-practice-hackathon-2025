import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@repo/common/auth-context";
import { Toaster } from "react-hot-toast";
import { RootLayout } from "./components/layout/RootLayout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Haufe - Share Your Code",
  description: "Share and discover amazing code projects",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <AuthProvider>
          <RootLayout>
            {children}
          </RootLayout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
