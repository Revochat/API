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
const Message_1 = __importDefault(require("../../database/models/Message"));
const Channel_1 = __importDefault(require("../../database/models/Channel"));
const utils_1 = __importDefault(require("../../utils"));
const logger_1 = __importDefault(require("../../logger"));
exports.default = {
    name: utils_1.default.EVENTS.Message.Send,
    description: "Send a message",
    run: function (socket, data, e) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!socket.revo.logged)
                    return socket.emit(utils_1.default.EVENTS.Message.Send, { error: "You are not logged in" });
                if (!data)
                    return socket.emit(utils_1.default.EVENTS.Message.Send, "Please provide a message");
                if (!data.message)
                    return socket.emit(utils_1.default.EVENTS.Message.Send, "Please provide a message");
                if (!data.channel_id)
                    return socket.emit(utils_1.default.EVENTS.Message.Send, "Please provide a channel id");
                const user = socket.revo.user;
                const channel = yield Channel_1.default.findOne({ channel_id: data.channel_id }); // check if the channel exists
                if (!channel)
                    return socket.emit(utils_1.default.EVENTS.Message.Send, "This channel doesn't exist");
                // check if the user is in the channel
                if (!channel.members.includes(user.user_id))
                    return socket.emit(utils_1.default.EVENTS.Message.Send, "This user isn't in this channel");
                var message = yield Message_1.default.create({
                    user_id: user.user_id,
                    channel_id: channel.channel_id,
                    message: data.message
                });
                logger_1.default.info(`User ${user.username} sent a message in channel ${channel.channel_id}`);
                // populate the messages with the user data
                const author = yield User_1.default.findOne({ user_id: message.user_id });
                if (!author)
                    return socket.emit(utils_1.default.EVENTS.Message.Send, { error: "An error occured" });
                message = message.toObject();
                message.user = author.toObject();
                delete message.user.password;
                delete message.user.token;
                socket.emit(utils_1.default.EVENTS.Message.Send, { message }); // send the message to the sender
                socket.to(channel.channel_id).emit(utils_1.default.EVENTS.Message.Send, { message }); // send the message to the channel
                return socket;
            }
            catch (error) {
                logger_1.default.error(error);
                return socket.emit(utils_1.default.EVENTS.Message.Send, { error: "An error occured" });
            }
        });
    }
};
