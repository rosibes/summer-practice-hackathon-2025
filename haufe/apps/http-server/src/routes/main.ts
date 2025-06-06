import express from "express";
import { userRouter } from "./user";
import { projectRouter } from "./project";

const mainRouter: express.Router = express.Router();

mainRouter.use("/user", userRouter);
mainRouter.use("/projects", projectRouter);

mainRouter.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello World"
    });
});

export default mainRouter;