import { prismaClient } from '@repo/prisma/client';
import express, { Request, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from "../middlewares/user";

const improvementRouter: express.Router = express.Router();

// Get all improvements for a project
improvementRouter.get("/project/:projectId", async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;

        if (!projectId) {
            res.status(400).json({
                message: "Project ID is required"
            });
            return;
        }

        const improvements = await prismaClient.improvement.findMany({
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
            improvements
        });

    } catch (err) {
        console.error('Error getting improvements:', err);
        res.status(500).json({
            message: "Internal server error"
        });
        return;
    }
});

improvementRouter.post("/project/:projectId", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { projectId } = req.params;
        const { title, description, status } = req.body;
        const userId = req.userId;

        if (!title || !description) {
            res.status(400).json({
                message: "Title and description are required"
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

        const improvement = await prismaClient.improvement.create({
            data: {
                title,
                description,
                status: status || "pending",
                projectId,
                userId
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
            message: "Improvement added successfully",
            improvement
        });

    } catch (err) {
        console.error('Error adding improvement:', err);
        res.status(500).json({
            message: "Internal server error"
        });
        return;
    }
});

// Update an improvement
improvementRouter.put("/:improvementId", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { improvementId } = req.params;
        const { title, description, priority, status } = req.body;
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({
                message: "User not authenticated"
            });
            return;
        }

        if (!improvementId) {
            res.status(400).json({
                message: "Improvement ID is required"
            });
            return;
        }

        const improvement = await prismaClient.improvement.findFirst({
            where: {
                id: improvementId,
                userId
            }
        });

        if (!improvement) {
            res.status(404).json({
                message: "Improvement not found or you don't have permission to update it"
            });
            return;
        }

        const updatedImprovement = await prismaClient.improvement.update({
            where: { id: improvementId },
            data: {
                title: title || improvement.title,
                description: description || improvement.description,
                status: status || improvement.status
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

        res.status(200).json({
            message: "Improvement updated successfully",
            improvement: updatedImprovement
        });

    } catch (err) {
        console.error('Error updating improvement:', err);
        res.status(500).json({
            message: "Internal server error"
        });
        return;
    }
});

// Delete an improvement
improvementRouter.delete("/:improvementId", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { improvementId } = req.params;
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({
                message: "User not authenticated"
            });
            return;
        }

        if (!improvementId) {
            res.status(400).json({
                message: "Improvement ID is required"
            });
            return;
        }

        const improvement = await prismaClient.improvement.findFirst({
            where: {
                id: improvementId,
                userId
            }
        });

        if (!improvement) {
            res.status(404).json({
                message: "Improvement not found or you don't have permission to delete it"
            });
            return;
        }

        await prismaClient.improvement.delete({
            where: { id: improvementId }
        });

        res.status(200).json({
            message: "Improvement deleted successfully"
        });

    } catch (err) {
        console.error('Error deleting improvement:', err);
        res.status(500).json({
            message: "Internal server error"
        });
        return;
    }
});

export { improvementRouter }; 