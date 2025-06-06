"use client"

import { useAuth } from "@repo/common/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function Header() {
    const { isAuthenticated, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/signin");
    };

    return (
        <header className="bg-slate-800 text-white">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo și titlu */}
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold">Haufe</span>
                    </Link>

                    {/* Navigare */}
                    <nav className="flex items-center space-x-6">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/projects"
                                    className="hover:text-indigo-400 transition-colors"
                                >
                                    Projects
                                </Link>
                                <Link
                                    href="/projects/new"
                                    className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md transition-colors"
                                >
                                    New Project
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="hover:text-indigo-400 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/signin"
                                    className="hover:text-indigo-400 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
} 