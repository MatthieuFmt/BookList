"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatSocket = void 0;
const chatSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected");
        socket.on("join", (userId) => {
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
exports.chatSocket = chatSocket;
//# sourceMappingURL=socketio.config.js.map