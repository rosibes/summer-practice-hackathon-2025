"use client"
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
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

export default function EditProject({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        repositoryUrl: "",
        sourceCode: "",
        status: "pending"
    });
    const router = useRouter();
    const { checkAuth } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    router.push("/signin");
                    return;
                }

                const isAuthenticated = await checkAuth();
                if (!isAuthenticated) {
                    router.push("/signin");
                    return;
                }

                const response = await axios.get(`http://localhost:3001/api/v1/projects/${resolvedParams.id}`, {
                    headers: {
                        Authorization: `${token}`
                    },
                    withCredentials: true
                });

                const projectData = response.data.project;
                if (projectData) {
                    setProject(projectData);
                    setFormData({
                        title: projectData.title,
                        description: projectData.description,
                        repositoryUrl: projectData.repositoryUrl || "",
                        sourceCode: projectData.sourceCode || "",
                        status: projectData.status
                    });
                }
                setLoading(false);
            } catch (error: any) {
                console.error("Error:", error);
                if (error.response?.status === 401 || error.response?.status === 403) {
                    toast.error("Session expired. Please sign in again.");
                    router.push("/signin");
                } else {
                    toast.error("Failed to load project details");
                }
                setLoading(false);
            }
        };

        fetchData();
    }, [resolvedParams.id, router, checkAuth]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/signin");
                return;
            }

            await axios.put(
                `http://localhost:3001/api/v1/projects/${resolvedParams.id}`,
                formData,
                {
                    headers: {
                        Authorization: `${token}`
                    },
                    withCredentials: true
                }
            );

            toast.success("Project updated successfully");
            router.push(`/projects/${resolvedParams.id}`);
        } catch (error: any) {
            console.error("Error updating project:", error);
            toast.error("Failed to update project");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Edit Project</h1>
                    <button
                        onClick={() => router.push(`/projects/${resolvedParams.id}`)}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-400 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-400 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="repositoryUrl" className="block text-sm font-medium text-slate-400 mb-2">
                            Repository URL
                        </label>
                        <input
                            type="url"
                            id="repositoryUrl"
                            name="repositoryUrl"
                            value={formData.repositoryUrl}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="sourceCode" className="block text-sm font-medium text-slate-400 mb-2">
                            Source Code
                        </label>
                        <input
                            type="text"
                            id="sourceCode"
                            name="sourceCode"
                            value={formData.sourceCode}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-slate-400 mb-2">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.push(`/projects/${resolvedParams.id}`)}
                            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 