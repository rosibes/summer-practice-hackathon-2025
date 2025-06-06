"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@repo/common/auth-context";

interface Project {
    id: string;
    title: string;
    description: string;
    repositoryUrl?: string;
    sourceCode?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
}

export function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { checkAuth } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const isAuthenticated = await checkAuth();
                if (!isAuthenticated) {
                    console.log("[Dashboard] Not authenticated, redirecting to signin");
                    router.push("/signin");
                    return;
                }
                await fetchProjects();
            } catch (error) {
                console.error("[Dashboard] Error during authentication check:", error);
                toast.error("Authentication failed");
                router.push("/signin");
            }
        };
        fetchData();
    }, [checkAuth, router]);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log("[Dashboard] Fetching projects, token exists:", !!token);
            if (!token) {
                console.log("[Dashboard] No token found, redirecting to signin");
                router.push("/signin");
                return;
            }
            const response = await axios.get('http://localhost:3001/api/v1/projects', {
                headers: {
                    Authorization: `${token}`
                },
                withCredentials: true
            });
            console.log("[Dashboard] Projects fetched successfully");
            setProjects(response.data.projects);
            setLoading(false);
        } catch (error: any) {

            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error("Session expired. Please sign in again.");
                router.push("/signin");
            } else {
                toast.error("Failed to load projects");
            }
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex justify-center items-center">
                <div className="text-white text-xl">Loading projects...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">My Projects</h1>
                    <button
                        onClick={() => router.push('/projects/new')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Create New Project
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-slate-800 p-6 hover:bg-slate-700 transition-colors cursor-pointer rounded-lg"
                            onClick={() => router.push(`/projects/${project.id}`)}
                        >
                            <h2 className="text-xl font-semibold text-white mb-2">{project.title}</h2>
                            <p className="text-slate-300 mb-4">{project.description}</p>
                            <div className="text-sm text-slate-400">
                                <p>Status: {project.status}</p>
                                <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                                <p>Updated: {new Date(project.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="text-center text-white mt-8">
                        <p className="text-xl">No projects found</p>
                        <p className="text-slate-400 mt-2">Create your first project to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
} 