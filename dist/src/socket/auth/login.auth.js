"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../database/models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.default = {
    name: "login",
    description: "Login to the server",
    run: function (socket, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.username || !data.password)
                return socket.emit("login", { error: "Missing username or password" });
            const user = yield User_1.default.findOne({ username: data.username });
            if (!user)
                return socket.emit("login", { error: "User not found" });
            const password = yield bcrypt_1.default.compare(data.password, user.password);
            if (!password)
                return socket.emit("login", { error: "Invalid password" });
            socket.revo.logged = true;
            socket.revo.user = user;
            socket.emit("login", { success: "You are now logged in" });
            return socket;
        });
    }
};
