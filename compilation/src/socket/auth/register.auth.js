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
exports.default = {
    name: "register",
    description: "Register a new user",
    run: (socket, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (!data)
            return socket.emit("register", "Please provide a username and a password");
        if (!data.username)
            return socket.emit("register", "Please provide a username");
        if (!data.password)
            return socket.emit("register", "Please provide a password");
        const user = yield User_1.default.findOne({ username: data.username });
        if (user)
            return socket.emit("register", "This username is already taken");
        // const newUser = new User({
        //     username: data.username,
        //     password: data.password
        // })
        socket.revo.logged = true;
        socket.emit("register", "Your account has been created !");
    })
};
