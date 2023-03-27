import express, { Request, Response } from "express";
import { connectToDatabase } from "./config/database";
import userRoutes from "./routes/user.routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectToDatabase();

// Middleware
app.use(express.json());

// Routes
app.use("/users", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Bonjour, voici mon API !");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
