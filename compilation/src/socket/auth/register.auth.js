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
const utils_1 = __importDefault(require("../../utils"));
const logger_1 = __importDefault(require("../../logger"));
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
        const asciiUsername = data.username;
        const user = yield User_1.default.findOne({ username: asciiUsername });
        if (user)
            return socket.emit("register", "This username is already taken");
        const newUser = yield User_1.default.create({
            username: asciiUsername,
            password: yield bcrypt_1.default.hash(data.password, 10),
            user_id: utils_1.default.GENERATE.USER.default.ID,
            identifier: asciiUsername,
            token: utils_1.default.GENERATE.USER.default.TOKEN,
            wallet_token: null,
            premium_expiration: null,
            avatar: "default",
            message_privacy: "everyone",
            status: "offline",
            updated_at: new Date(),
            created_at: new Date(),
            last_connection: new Date(),
            servers: [],
            channels: [],
            friends: [],
            friends_requests_received: [],
            friends_requests_sent: [],
            blocked: []
        });
        socket.revo.logged = true;
        socket.revo.user = newUser;
        logger_1.default.info(`User ${newUser.username} has been created !`);
        socket.emit("register", "Your account has been created !");
        return socket;
    })
};
