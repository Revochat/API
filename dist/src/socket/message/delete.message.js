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
const Message_1 = __importDefault(require("../../database/models/Message"));
const Channel_1 = __importDefault(require("../../database/models/Channel"));
const utils_1 = __importDefault(require("../../utils"));
const logger_1 = __importDefault(require("../../logger"));
exports.default = {
    name: utils_1.default.EVENTS.Message.Delete,
    description: "Delete a message",
    run: function (socket, data, e) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!socket.revo.logged)
                    return socket.emit(utils_1.default.EVENTS.Message.Delete, { error: "You are not logged in" });
                if (!data || !data.message_id)
                    return socket.emit(utils_1.default.EVENTS.Message.Delete, { error: "Please provide a message_id" });
                const user = socket.revo.user;
                const message = yield Message_1.default.findOne({ message_id: data.message_id }); // find the message
                if (!message)
                    return socket.emit(utils_1.default.EVENTS.Message.Delete, { error: "Message not found" });
                const channel = yield Channel_1.default.findOne({ channel_id: message.channel_id }); // find the channel
                if (!channel)
                    return socket.emit(utils_1.default.EVENTS.Message.Delete, { error: "Channel not found" });
                // Check if the user has permission to delete the message (check if it's their message or if they have permissions)
                if (message.user_id !== user.user_id) {
                    // Check for permissions or additional criteria here, if applicable
                    return socket.emit(utils_1.default.EVENTS.Message.Delete, { error: "You do not have permission to delete this message" });
                }
                yield Message_1.default.deleteOne({ message_id: data.message_id }); // delete the message from the database
                logger_1.default.info(`User ${user.username} deleted a message in channel ${channel.channel_id}`);
                socket.emit(utils_1.default.EVENTS.Message.Delete, { success: "Message deleted successfully" });
                socket.to(channel.channel_id).emit(utils_1.default.EVENTS.Message.Delete, { message_id: data.message_id }); // send notification to delete the message in the channel
                return socket;
            }
            catch (error) {
                logger_1.default.error(error);
                socket.emit(utils_1.default.EVENTS.Message.Delete, { error: "An error occured" });
            }
        });
    }
};
