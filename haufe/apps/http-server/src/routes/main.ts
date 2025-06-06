import express from "express";
import { userRouter } from "./user";
import { projectRouter } from "./project";
import { commentRouter } from "./comment";
import { improvementRouter } from "./improvement";

const mainRouter: express.Router = express.Router();

mainRouter.use("/users", userRouter);
mainRouter.use("/projects", projectRouter);
mainRouter.use("/comments", commentRouter);
mainRouter.use("/improvements", improvementRouter);

mainRouter.get("/", (req, res) => {
    res.send("Hello World");
});

export { mainRouter };