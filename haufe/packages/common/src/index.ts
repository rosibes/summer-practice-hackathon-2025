
import zod, { z } from "zod"

export const CreateUserSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6),
    username: zod.string().min(3)
})

export const SignInSchema = zod.object({
    email: zod.string().email(),
    password: zod.string(),
})

export const ProjectSchema = zod.object({
    title: zod.string().min(1, "Title is required"),
    description: zod.string().optional(),
    repositoryUrl: zod.string().url().optional(),
});


