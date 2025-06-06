import { ProjectSchema } from '@repo/common/types';
import { prismaClient } from "@repo/prisma/client";
import express, { Request, Response } from "express";
import { authMiddleware, AuthenticatedRequest } from "../middlewares/user";

const projectRouter: express.Router = express.Router();

projectRouter.get("/", async (req, res) => {
    const projects = await prismaClient.project.findMany();
    res.status(200).json({
        projects
    });
});

projectRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    const project = await prismaClient.project.findUnique({
        where: { id }
    });
    res.status(200).json({
        project
    });
});

projectRouter.post("/", authMiddleware, async (req, res) => {
    try {
        const parsedData = ProjectSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(400).json({
                message: "Invalid inputs",
                errors: parsedData.error.flatten(),
            });
            return
        }

        const { title, description, repositoryUrl, sourceCode } = parsedData.data;
        //@ts-ignore
        const userId = req.userId;

        const project = await prismaClient.project.create({
            data: {
                title,
                description,
                repositoryUrl,
                sourceCode,
                userId,
                status: "pending"
            }
        });

        res.status(201).json({
            message: "Project created successfully",
            project: {
                id: project.id,
                title: project.title,
                description: project.description,
                repositoryUrl: project.repositoryUrl,
                sourceCode: project.sourceCode,
                status: project.status,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                userId: project.userId
            }
        });
        return

    } catch (err) {
        console.error('Error creating project:', err);
        res.status(500).json({
            message: "Internal server error"
        });
        return
    }
});

projectRouter.put("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, description, repositoryUrl } = req.body;
    const project = await prismaClient.project.update({
        where: { id },
        data: { title, description, repositoryUrl }
    });
    res.status(200).json({
        message: "Project updated successfully",
        project
    });
    return
});

projectRouter.delete("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    await prismaClient.project.delete({
        where: { id }
    });
    res.status(200).json({
        message: "Project deleted successfully"
    });
    return
});
export { projectRouter };