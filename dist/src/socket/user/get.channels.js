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
const Channel_1 = __importDefault(require("../../database/models/Channel"));
const User_1 = __importDefault(require("../../database/models/User"));
const logger_1 = __importDefault(require("../../logger"));
const utils_1 = __importDefault(require("../../utils"));
const Message_1 = __importDefault(require("../../database/models/Message"));
exports.default = {
    name: utils_1.default.EVENTS.User.GetChannels,
    description: "Get the user's channels",
    run: function (socket, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!socket.revo.logged)
                    return socket.emit(utils_1.default.EVENTS.User.Get, { error: "You are not logged in" });
                logger_1.default.info(`[Socket] ${socket.revo.user.username} is trying to get their channels`);
                const user = yield User_1.default.findOne({ token: socket.revo.user.token }); // find the user
                if (!user)
                    return socket.emit(utils_1.default.EVENTS.User.Get, { error: "Invalid token" });
                let channels = [];
                for (let i = 0; i < user.channels.length; i++) {
                    const channel = yield Channel_1.default.findOne({ _id: user.channels[i] });
                    if (channel) {
                        // get the users from the channel
                        let users = [];
                        for (let j = 0; j < channel.members.length; j++) {
                            const user = yield User_1.default.findOne({ _id: channel.members[j] });
                            if (user) {
                                users.push({
                                    username: user.username,
                                    user_id: user._id,
                                    avatar: user.avatar,
                                    status: user.status
                                });
                            }
                        }
                        // get last message from channel
                        let lastMessage = null;
                        // get number of messages in message collection
                        const messages = yield Message_1.default.find({ channel_id: channel._id }).sort({ createdAt: -1 }).limit(1);
                        if (messages.length > 0) {
                            lastMessage = messages[0];
                            lastMessage = lastMessage.toObject();
                        }
                        // sort channels by last message date (newest first)
                        // channels.sort((a, b) => {
                        //     if (!a.lastMessage || !b.lastMessage) return 0;
                        //     if (a.lastMessage.createdAt > b.lastMessage.createdAt) return -1;
                        //     if (a.lastMessage.createdAt < b.lastMessage.createdAt) return 1;
                        //     return 0;
                        // });
                        channels.push({
                            channel_id: channel._id,
                            name: channel.channel_name,
                            members: users,
                            lastMessage: lastMessage
                        });
                    }
                }
                socket.emit(utils_1.default.EVENTS.User.GetChannels, channels);
            }
            catch (error) {
                logger_1.default.error(error);
                socket.emit(utils_1.default.EVENTS.User.GetChannels, { error: "An error occured" });
            }
        });
    }
};
