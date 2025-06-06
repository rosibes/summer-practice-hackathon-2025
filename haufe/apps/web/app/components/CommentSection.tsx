"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "@repo/common/auth-context";
import toast from "react-hot-toast";

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        username: string;
        avatarUrl: string | null;
    };
}

interface CommentSectionProps {
    projectId: string;
}

export function CommentSection({ projectId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const { checkAuth } = useAuth();

    useEffect(() => {
        fetchComments();
    }, [projectId]);

    const fetchComments = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await axios.get(`http://localhost:3001/api/v1/comments/project/${projectId}`, {
                headers: {
                    Authorization: `${token}`
                },
                withCredentials: true
            });
            setComments(response.data.comments);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching comments:', error);
            toast.error('Failed to load comments');
            setLoading(false);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error('Please sign in to comment');
                return;
            }

            const response = await axios.post(
                `http://localhost:3001/api/v1/comments/project/${projectId}`,
                { content: newComment },
                {
                    headers: {
                        Authorization: `${token}`
                    },
                    withCredentials: true
                }
            );

            setComments([response.data.comment, ...comments]);
            setNewComment('');
            toast.success('Comment added successfully');
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Failed to add comment');
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            await axios.delete(`http://localhost:3001/api/v1/comments/${commentId}`, {
                headers: {
                    Authorization: `${token}`
                },
                withCredentials: true
            });

            setComments(comments.filter(comment => comment.id !== commentId));
            toast.success('Comment deleted successfully');
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Failed to delete comment');
        }
    };

    if (loading) {
        return <div className="text-white">Loading comments...</div>;
    }

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">Comments</h3>

            <form onSubmit={handleAddComment} className="mb-6">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-3 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                />
                <button
                    type="submit"
                    className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Post Comment
                </button>
            </form>

            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="bg-slate-800 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                {comment.user.avatarUrl ? (
                                    <img
                                        src={comment.user.avatarUrl}
                                        alt={comment.user.username}
                                        className="w-8 h-8 rounded-full"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                                        { }
                                    </div>
                                )}
                                <span className="text-white font-medium">{comment.user.username}</span>
                            </div>
                            <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                        <p className="text-slate-300">{comment.content}</p>
                        <p className="text-sm text-slate-400 mt-2">
                            {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
} 