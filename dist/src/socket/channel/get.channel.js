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
const logger_1 = __importDefault(require("../../logger"));
const Message_1 = __importDefault(require("../../database/models/Message"));
const utils_1 = __importDefault(require("../../utils"));
exports.default = {
    name: utils_1.default.EVENTS.Channel.Get,
    description: "get a channel",
    run: function (socket, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!socket.revo.logged)
                    return socket.emit(utils_1.default.EVENTS.Channel.Get, { error: "You are not logged in" });
                if (!data.channel_id)
                    return socket.emit(utils_1.default.EVENTS.Channel.Get, { error: "Missing channel_id" });
                const user = socket.revo.user; // get the user from the socket
                const userDocument = yield User_1.default.findOne({ user_id: user.user_id }); // find the user document
                if (!userDocument)
                    return socket.emit(utils_1.default.EVENTS.Channel.Get, { error: "User not found" });
                if (!userDocument.channels.includes(data.channel_id))
                    return socket.emit(utils_1.default.EVENTS.Channel.Get, { error: "You are not in this channel" });
                // get the last 50 messages from the channel
                const limit = data.limit ? data.limit : 25;
                const messages = yield Message_1.default.find({ channel_id: data.channel_id }).sort({ createdAt: -1 }).limit(limit);
                messages.reverse(); // reverse the messages array so the newest messages are at the bottom
                logger_1.default.info(`User ${user.username} (${user.user_id}) got ${messages.length} messages from channel ${data.channel_id}`);
                // populate the messages with the user data
                for (let i = 0; i < messages.length; i++) {
                    const message = messages[i];
                    const author = yield User_1.default.findOne({ user_id: message.user_id });
                    if (!author)
                        return socket.emit(utils_1.default.EVENTS.Channel.Get, { error: "An error occured" });
                    messages[i] = messages[i].toObject();
                    messages[i].user = author.toObject();
                    delete messages[i].user.password;
                    delete messages[i].user.token;
                }
                socket.emit(utils_1.default.EVENTS.Channel.Get, { messages: messages });
            }
            catch (error) {
                logger_1.default.error(error);
                socket.emit(utils_1.default.EVENTS.Channel.Get, { error: "An error occured" });
            }
        });
    }
};
