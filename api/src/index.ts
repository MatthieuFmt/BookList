import express, { Request, Response } from "express";

import dotenv from "dotenv";

import { connectToDatabase } from "./config/database.config";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import bookRoutes from "./routes/book.routes";
import conversationRoutes from "./routes/conversation.route";

import authMiddleware from "./middleware/auth.middleware";
import { limiter } from "./middleware/rate-limit.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectToDatabase();

app.use(express.json());

// Routes
// limite le nombre de requêtes par adresse ip
app.use(limiter);

app.use("/auth", authRoutes);

// donne l'accès aux routes suivantes seulement si l'utilisateur renvoie un token valide
app.use(authMiddleware);

app.use("/user", userRoutes);
app.use("/book", bookRoutes);
app.use("/conversation", conversationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
