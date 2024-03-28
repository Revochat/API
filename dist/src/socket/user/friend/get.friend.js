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
const User_1 = __importDefault(require("../../../database/models/User"));
const logger_1 = __importDefault(require("../../../logger"));
const utils_1 = __importDefault(require("../../../utils"));
exports.default = {
    name: utils_1.default.EVENTS.User.GetFriendsList,
    description: "Get the user's friends list",
    run: function (socket, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!socket.revo.logged)
                    return socket.emit(utils_1.default.EVENTS.User.GetFriendsList, { error: "You are not logged in" });
                logger_1.default.info(`[Socket] ${socket.revo.user.username} is trying to get their channels`);
                const user = yield User_1.default.findOne({ token: socket.revo.user.token }); // find the user
                if (!user)
                    return socket.emit(utils_1.default.EVENTS.User.GetFriendsList, { error: "Invalid token" });
                const friends = yield User_1.default.find({ user_id: { $in: user.friends } });
                if (!friends)
                    return socket.emit(utils_1.default.EVENTS.User.GetFriendsList, { error: "No friends found" });
                for (let i = 0; i < friends.length; i++) {
                    friends[i] = utils_1.default.removeSensitiveData(friends[i]);
                }
                socket.emit(utils_1.default.EVENTS.User.GetFriendsList, friends);
            }
            catch (error) {
                logger_1.default.error(error);
                socket.emit(utils_1.default.EVENTS.User.GetFriendsList, { error: "An error occured" });
            }
        });
    }
};
