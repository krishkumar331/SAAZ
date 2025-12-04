import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import eventRoutes from "./routes/eventRoutes";
import uploadRoutes from "./routes/uploadRoutes";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*", // Allow all origins temporarily to fix CORS issues
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/upload", uploadRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("SAAZ Backend is running!");
});

export default app;
