"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import http from "http";
// import { Server } from "socket.io";
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_config_1 = require("./config/database.config");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const book_routes_1 = __importDefault(require("./routes/book.routes"));
const conversation_route_1 = __importDefault(require("./routes/conversation.route"));
const auth_middleware_1 = __importDefault(require("./middleware/auth.middleware"));
const rate_limit_middleware_1 = require("./middleware/rate-limit.middleware");
// import { chatSocket } from "./config/socketio.config";
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
// connection à la base de données MongoDB
(0, database_config_1.connectToDatabase)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// limite le nombre de requêtes par adresse ip
app.use(rate_limit_middleware_1.limiter);
// permet d'accéder aux photos de profils uploadées
app.get("/uploads/:filename", (req, res) => {
    const filename = req.params.filename;
    const imagePath = path_1.default.join(__dirname, "uploads", filename);
    console.log("__dirname");
    console.log(__dirname);
    res.sendFile(imagePath);
});
// routes
app.use("/auth", auth_routes_1.default);
// donne l'accès aux routes suivantes seulement si l'utilisateur renvoie un token valide
app.use(auth_middleware_1.default);
app.use("/user", user_routes_1.default);
app.use("/book", book_routes_1.default);
app.use("/conversation", conversation_route_1.default);
// Set up HTTP server and Socket.IO server
// const server = http.createServer(app);
// const io = new Server(server);
// Configure Socket.IO for chat
// chatSocket(io);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map