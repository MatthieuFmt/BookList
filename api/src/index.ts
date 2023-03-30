import express, { Request, Response } from "express";
import { connectToDatabase } from "./config/database";
import userRoutes from "./routes/user.routes";
import bookRoutes from "./routes/book.routes";
import conversationRoutes from "./routes/conversation.route";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectToDatabase();

// Middleware
app.use(express.json());

// Routes
app.use("/user", userRoutes);
app.use("/book", bookRoutes);
app.use("/conversation", conversationRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("BookList api");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
