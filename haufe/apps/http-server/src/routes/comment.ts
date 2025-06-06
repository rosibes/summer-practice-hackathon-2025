import { prismaClient } from '@repo/prisma/client';
import express, { Request, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from "../middlewares/user";

const commentRouter: express.Router = express.Router();

commentRouter.get("/project/:projectId", async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;

        if (!projectId) {
            res.status(400).json({
                message: "Project ID is required"
            });
            return;
        }

        const comments = await prismaClient.comment.findMany({
            where: { projectId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({
            comments
        });

    } catch (err) {
        console.error('Error getting comments:', err);
        res.status(500).json({
            message: "Internal server error"
        });
        return;
    }
});

commentRouter.post("/project/:projectId", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { projectId } = req.params;
        const { content } = req.body;
        const userId = req.userId;

        if (!content) {
            res.status(400).json({
                message: "Comment content is required"
            });
            return;
        }

        if (!userId) {
            res.status(401).json({
                message: "User not authenticated"
            });
            return;
        }

        if (!projectId) {
            res.status(400).json({
                message: "Project ID is required"
            });
            return;
        }

        const project = await prismaClient.project.findUnique({
            where: { id: projectId }
        });

        if (!project) {
            res.status(404).json({
                message: "Project not found"
            });
            return;
        }

        const comment = await prismaClient.comment.create({
            data: {
                content: content,
                projectId: projectId,
                userId: userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true
                    }
                }
            }
        });

        res.status(201).json({
            message: "Comment added successfully",
            comment
        });

    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({
            message: "Internal server error"
        });
        return;
    }
});

commentRouter.delete("/:commentId", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { commentId } = req.params;
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({
                message: "User not authenticated"
            });
            return;
        }

        if (!commentId) {
            res.status(400).json({
                message: "Comment ID is required"
            });
            return;
        }

        const comment = await prismaClient.comment.findFirst({
            where: {
                id: commentId,
                userId
            }
        });

        if (!comment) {
            res.status(404).json({
                message: "Comment not found or you don't have permission to delete it"
            });
            return;
        }

        await prismaClient.comment.delete({
            where: { id: commentId }
        });

        res.status(200).json({
            message: "Comment deleted successfully"
        });

    } catch (err) {
        console.error('Error deleting comment:', err);
        res.status(500).json({
            message: "Internal server error"
        });
        return;
    }
});

export { commentRouter }; 