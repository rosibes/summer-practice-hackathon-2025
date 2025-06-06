import { CreateUserSchema, SignInSchema } from '@repo/common/types';
import { prismaClient } from '@repo/prisma/client';
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/common/key';
import { authMiddleware, AuthenticatedRequest } from "../middlewares/user";
const userRouter: express.Router = express.Router();

userRouter.get("/", (req, res) => {
    res.status(200).json({
        message: "User route"
    });
});

userRouter.post("/signup", async (req: Request, res: Response) => {
    try {
        const parsedData = await CreateUserSchema.safeParse(req.body)
        if (!parsedData.success) {
            res.status(400).json({
                message: "Invalid inputs",
                errors: parsedData.error.flatten(),
            })
            return
        }

        const { email, password, username } = parsedData.data;


        const existingUser = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        });

        if (existingUser) {
            res.status(411).json({
                message: "User aleady exists"
            })
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prismaClient.user.create({
            data: {
                email: email,
                username: username,
                password: hashedPassword
            }
        })

        res.status(201).json({
            userId: user.id,
            message: "User created successfully"
        });
        return

    } catch (err) {
        console.error('Error during signup:', err);
        res.status(500).json({
            message: "Internal server error"
        });
        return
    }

})

userRouter.post("/signin", async (req: Request, res: Response) => {
    try {
        const parsedData = SignInSchema.safeParse(req.body)
        console.log("test")
        if (!parsedData.success) {
            res.status(400).json({
                message: "Invalid inputs",
                errors: parsedData.error.flatten(),
            })
            return
        }

        const { email, password } = parsedData.data

        const existingUser = await prismaClient.user.findFirst({
            where: {
                email: email,
            }
        });

        if (!existingUser) {
            res.status(401).json({
                message: "Invalid email or password",
            });
            return
        }
        const isValidPassword = await bcrypt.compare(password, existingUser.password)
        if (!isValidPassword) {
            res.status(401).json({
                message: "Invalid email or password",
            });
            return
        }

        const userId = existingUser.id;
        const token = jwt.sign({
            userId
        }, JWT_SECRET)

        res.status(200).json({
            userId: userId,
            token: token,
            email: existingUser.email,
            username: existingUser.username,
            message: "Sign in succesfull!"
        });
        return

    } catch (err) {
        console.error('Error during signin:', err);
        res.status(500).json({
            message: "Internal server error"
        });
        return
    }
})

userRouter.get("/me", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return
        }

        const user = await prismaClient.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return
        }

        res.status(200).json({
            userId: user.id,
            email: user.email,
            username: user.username
        });
        return
    } catch (err) {
        console.error('Error getting user details:', err);
        res.status(500).json({ message: "Internal server error" });
        return
    }
});

export { userRouter };