"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@repo/common/auth-context";
import toast from "react-hot-toast";

export default function NewProject() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [repositoryUrl, setRepositoryUrl] = useState("");
    const [sourceCode, setSourceCode] = useState("");
    const router = useRouter();
    const { user } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3001/api/v1/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token") || "",
                },
                body: JSON.stringify({
                    title,
                    description,
                    repositoryUrl,
                    sourceCode,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create project");
            }

            toast.success("Project created successfully!");
            router.push("/projects");
        } catch (error) {
            console.error("Error creating project:", error);
            toast.error("Failed to create project");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">Create New Project</h1>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows={4}
                    />
                </div>

                <div>
                    <label htmlFor="repositoryUrl" className="block text-sm font-medium text-white mb-2">
                        Repository URL (optional)
                    </label>
                    <input
                        type="url"
                        id="repositoryUrl"
                        value={repositoryUrl}
                        onChange={(e) => setRepositoryUrl(e.target.value)}
                        className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="sourceCode" className="block text-sm font-medium text-white mb-2">
                        Source Code
                    </label>
                    <textarea
                        id="sourceCode"
                        value={sourceCode}
                        onChange={(e) => setSourceCode(e.target.value)}
                        className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                        rows={10}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                    Create Project
                </button>
            </form>
        </div>
    );
} 