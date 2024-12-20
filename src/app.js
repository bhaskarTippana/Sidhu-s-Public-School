// src/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";  // Auth routes
import { authMiddleware } from "./middlewares/authMiddleware.js";  // Token middleware

dotenv.config();  // Load environment variables

const app = express();

// Middleware setup
app.use(express.json());  // For parsing JSON request bodies
app.use(cookieParser());  // For handling cookies
app.use(cors({
  origin: "*",  // Replace with your actual domain in production
  credentials: true,
}));

// Define routes
app.use("/api/auth", authRoutes);  // Auth routes

// Example protected route using auth middleware
app.get("/api/protected", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Protected content" });
});

export default app;  // Export the app instance so it can be used in server.js
