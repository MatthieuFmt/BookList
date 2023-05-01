import { Server, Socket } from "socket.io";

interface UserSocket extends Socket {
  userId?: string;
}

export const chatSocket = (io: Server) => {
  io.on("connection", (socket: UserSocket) => {
    console.log("User connected");

    socket.on("join", (userId: string) => {
      console.log(`User ${userId} joined`);
      socket.userId = userId;
      socket.join(userId);
    });

    socket.on("message", (data) => {
      const { to, message } = data;
      console.log(`Message from ${socket.userId} to ${to}: ${message}`);
      socket.to(to).emit("message", { from: socket.userId, message });
    });

    socket.on("disconnect", () => {
      console.log(`User ${socket.userId} disconnected`);
    });
  });
};
