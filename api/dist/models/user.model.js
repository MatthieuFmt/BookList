"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    pseudo: {
        type: String,
        required: [true, "Pseudo manquant"],
        unique: true,
        minlength: 3,
        maxlength: 20,
    },
    email: {
        type: String,
        required: [true, "Email manquant"],
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicturePath: {
        type: String,
        default: "/upload/default-user.png",
    },
    listRequestContacts: { type: [String], default: [] },
    listContacts: { type: [String], default: [] },
    listBooksToExchange: { type: [String], default: [] },
    listBooksAlreadyRead: { type: [String], default: [] },
    listWishBooks: { type: [String], default: [] },
    listConversations: { type: [String], default: [] },
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Number, default: null },
});
UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};
exports.User = (0, mongoose_1.model)("User", UserSchema);
//# sourceMappingURL=user.model.js.map