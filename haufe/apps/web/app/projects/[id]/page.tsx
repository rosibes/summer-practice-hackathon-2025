"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@repo/common/auth-context";
import { CommentSection } from "../../components/CommentSection";

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

interface PageProps {
    params: {
        id: string;
    };
}

export default function ProjectDetails({ params }: PageProps) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { checkAuth } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const isAuthenticated = await checkAuth();
                if (!isAuthenticated) {
                    router.push("/signin");
                    return;
                }
                await fetchProject();
            } catch (error) {
                console.error("Error during authentication check:", error);
                toast.error("Authentication failed");
                router.push("/signin");
            }
        };
        fetchData();
    }, [checkAuth, router, params.id]);

    const fetchProject = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/signin");
                return;
            }

            const response = await axios.get(`http://localhost:3001/api/v1/projects/${params.id}`, {
                headers: {
                    Authorization: `${token}`
                },
                withCredentials: true
            });

            setProject(response.data.project);
            setLoading(false);
        } catch (error: any) {
            console.error("Error fetching project:", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error("Session expired. Please sign in again.");
                router.push("/signin");
            } else {
                toast.error("Failed to load project details");
            }
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this project?")) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/signin");
                return;
            }

            await axios.delete(`http://localhost:3001/api/v1/projects/${params.id}`, {
                headers: {
                    Authorization: `${token}`
                },
                withCredentials: true
            });

            toast.success("Project deleted successfully");
            router.push("/projects");
        } catch (error: any) {
            console.error("Error deleting project:", error);
            toast.error("Failed to delete project");
        }
    };

    const handleUpdate = () => {
        router.push(`/projects/${params.id}/edit`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex justify-center items-center">
                <div className="text-white text-xl">Loading project details...</div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-slate-900 flex justify-center items-center">
                <div className="text-white text-xl">Project not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">{project.title}</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={handleUpdate}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Edit Project
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Delete Project
                        </button>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-4">Project Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-slate-400">Status</p>
                                    <p className="text-white capitalize">{project.status}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400">User ID</p>
                                    <p className="text-white">{project.userId}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400">Created At</p>
                                    <p className="text-white">{new Date(project.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400">Last Updated</p>
                                    <p className="text-white">{new Date(project.updatedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-4">Links</h2>
                            <div className="space-y-4">
                                {project.repositoryUrl && (
                                    <div>
                                        <p className="text-slate-400">Repository URL</p>
                                        <a
                                            href={project.repositoryUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-400 hover:text-indigo-300 break-all"
                                        >
                                            {project.repositoryUrl}
                                        </a>
                                    </div>
                                )}
                                {project.sourceCode && (
                                    <div>
                                        <p className="text-slate-400">Source Code</p>
                                        <a
                                            href={project.sourceCode}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-400 hover:text-indigo-300 break-all"
                                        >
                                            {project.sourceCode}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
                    <p className="text-slate-300 whitespace-pre-wrap">{project.description}</p>
                </div>

                <CommentSection projectId={project.id} />
            </div>
        </div>
    );
} 