import express from "express";
import mainRouter from "./routes/main";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/v1", mainRouter);

app.listen(3001, () => {
    console.log("Server is running on port 3001");

})

