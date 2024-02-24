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
const Channel_1 = __importDefault(require("../../database/models/Channel"));
const utils_1 = __importDefault(require("../../utils"));
const Server_1 = __importDefault(require("../../database/models/Server"));
const Role_1 = __importDefault(require("../../database/models/Role"));
exports.default = {
    name: utils_1.default.EVENTS.Server.Delete,
    description: "Delete a server",
    run: function (socket, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!socket.revo.logged)
                    return socket.emit(utils_1.default.EVENTS.Server.Delete, { error: "You are not logged in" });
                if (!data.server_id)
                    return socket.emit(utils_1.default.EVENTS.Server.Delete, { error: "Missing server_id" });
                const user = socket.revo.user; // get the user from the socket
                // get server information
                const server = yield Server_1.default.findOne({ server_id: data.server_id });
                if (!server)
                    return socket.emit(utils_1.default.EVENTS.Server.Delete, { error: "Server not found" });
                // check if the user is the owner of the server
                if (server.owner_id !== user.user_id)
                    return socket.emit(utils_1.default.EVENTS.Server.Delete, { error: "You do not have permission to delete this server" });
                // delete server roles
                yield Role_1.default.deleteMany({ role_server_id: data.server_id }, { role_id: { $nin: ["1", "2"] } }); // delete all roles except the default roles
                // remove server from users servers
                yield User_1.default.updateOne({ user_id: user.user_id }, { $pull: { servers: data.server_id } }); // remove server from user servers
                // remove server from server collection
                yield Server_1.default.deleteOne({ server_id: data.server_id });
                // remove channels from channel collection
                yield Channel_1.default.deleteMany({ server_id: data.server_id });
                logger_1.default.info(`User ${user.username} (${user.user_id}) deleted server ${data.server_id}`);
                // send notification to all members in the server
                socket.to(`server.${server.server_id}`).emit(utils_1.default.EVENTS.Server.Delete, { server_id: data.server_id });
                socket.emit(utils_1.default.EVENTS.Server.Delete, { success: "Server deleted successfully" });
            }
            catch (error) {
                logger_1.default.error(error);
                socket.emit(utils_1.default.EVENTS.Server.Delete, { error: "An error occurred" });
            }
        });
    }
};
