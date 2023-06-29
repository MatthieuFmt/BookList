"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transport = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transport = nodemailer_1.default.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.ADRESS_MAIL,
        pass: process.env.PASSWORD_MAIL,
    },
});
//# sourceMappingURL=nodemailer.config.js.map