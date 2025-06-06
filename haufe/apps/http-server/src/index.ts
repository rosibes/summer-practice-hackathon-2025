import express from "express";
import cors from "cors";
import { mainRouter } from "./routes/main";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
    origin: ["http://localhost:3000", "http://54.152.157.19", "http://ec2-54-152-157-19.compute-1.amazonaws.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/api/v1", mainRouter);

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});

