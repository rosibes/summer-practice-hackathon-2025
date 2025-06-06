"use client"

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { useAuth } from "@repo/common/auth-context";

export function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { isAuthenticated } = useAuth();
    const isAuthPage = pathname?.startsWith("/signin") || pathname?.startsWith("/signup");

    return (
        <>
            {isAuthenticated && !isAuthPage && <Header />}
            <main className="min-h-screen bg-slate-900">
                {children}
            </main>
        </>
    );
} 