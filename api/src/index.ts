import express, { Request, Response } from "express";
// import http from "http";
// import { Server } from "socket.io";
import cors from "cors";

import dotenv from "dotenv";

import { connectToDatabase } from "./config/database.config";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import bookRoutes from "./routes/book.routes";
import conversationRoutes from "./routes/conversation.route";

import authMiddleware from "./middleware/auth.middleware";
import { limiter } from "./middleware/rate-limit.middleware";
// import { chatSocket } from "./config/socketio.config";
import path from "path";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

// connection à la base de données MongoDB
connectToDatabase();

app.use(cors());
app.use(express.json());

// limite le nombre de requêtes par adresse ip
app.use(limiter);

// permet d'accéder aux photos de profils uploadées
app.get("/uploads/:filename", (req: Request, res: Response) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, "uploads", filename);

  res.sendFile(imagePath);
});

// routes
app.use("/auth", authRoutes);

// donne l'accès aux routes suivantes seulement si l'utilisateur renvoie un token valide
app.use(authMiddleware);

app.use("/user", userRoutes);
app.use("/book", bookRoutes);
app.use("/conversation", conversationRoutes);

// Set up HTTP server and Socket.IO server
// const server = http.createServer(app);
// const io = new Server(server);

// Configure Socket.IO for chat
// chatSocket(io);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
