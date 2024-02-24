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
const logger_1 = __importDefault(require("../../logger"));
const Channel_1 = __importDefault(require("../../database/models/Channel"));
const utils_1 = __importDefault(require("../../utils"));
const Server_1 = __importDefault(require("../../database/models/Server"));
// NOTE: DM CHANNELS ARE NOT CREATED HERE, THEY ARE CREATED WHEN A USER ADDS ANOTHER USER AS A FRIEND
exports.default = {
    name: utils_1.default.EVENTS.Channel.Create,
    description: "create a channel in a server",
    run: function (socket, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!socket.revo.logged)
                    return socket.emit(utils_1.default.EVENTS.Channel.Create, { error: "You are not logged in" });
                if (!data.server_id)
                    return socket.emit(utils_1.default.EVENTS.Channel.Create, { error: "Missing parameters" });
                const user = socket.revo.user; // get user from socket
                // check if user is in the server
                const server = yield Server_1.default.findOne({ where: { id: data.server_id } });
                if (!server)
                    return socket.emit(utils_1.default.EVENTS.Channel.Create, { error: "Server not found" });
                if (!server.members.includes(user.user_id))
                    return socket.emit(utils_1.default.EVENTS.Channel.Create, { error: "You are not in this server" });
                // check if user has permission to create a channel
                // create channel
                const channel = yield Channel_1.default.create({
                    channel_name: data.channel_name,
                    channel_category: "SERVER",
                    members: [user.user_id],
                    server_id: server.server_id,
                });
                // send channel to socket
                socket.emit(utils_1.default.EVENTS.Channel.Create, { channel });
                socket.to(`server.${data.server}`).emit(utils_1.default.EVENTS.Channel.Create, { channel });
            }
            catch (error) {
                logger_1.default.error(error);
                return socket.emit(utils_1.default.EVENTS.Channel.Create, { error: "An error occured" });
            }
        });
    }
};
