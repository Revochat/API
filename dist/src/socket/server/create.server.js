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
    name: utils_1.default.EVENTS.Server.Create,
    description: "create a server",
    run: function (socket, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!socket.revo.logged)
                    return socket.emit(utils_1.default.EVENTS.Server.Create, { error: "You are not logged in" });
                if (!data.name)
                    return socket.emit(utils_1.default.EVENTS.Server.Create, { error: "No name provided" });
                const user = socket.revo.user; // get user from socket
                // create server
                const server = yield Server_1.default.create({
                    server_name: data.name,
                    owner_id: user.id,
                    members: [{ user_id: user.id, roles: ["owner"] }],
                    members_count: 1,
                    roles: ['1', '2']
                });
                // if default server roles are not created
                const defaultRoles = yield Role_1.default.find({ role_id: { $in: ['1', '2'] } });
                if (defaultRoles.length !== 2) {
                    // create default roles
                    yield Role_1.default.create({
                        role_id: "2",
                        role_name: "admin",
                        role_color: "#FF0000",
                        role_members: [user.id],
                        role_position: 0,
                        role_server_id: server.server_id,
                        permissions: {
                            server: {
                                admin: true,
                                messages: {
                                    send: true
                                }
                            }
                        }
                    });
                    yield Role_1.default.create({
                        role_id: "1",
                        role_name: "member",
                        role_color: "#000000",
                        role_members: [user.id],
                        role_position: 1,
                        role_server_id: server.server_id,
                        permissions: {
                            server: {
                                admin: false,
                                messages: {
                                    send: true
                                }
                            }
                        }
                    });
                }
                // create channel for server
                const channel = yield Channel_1.default.create({
                    channel_name: data.name,
                    channel_category: "SERVER",
                    members: [user.user_id]
                });
                // add user to server
                const UserDocument = yield User_1.default.findOne({ user_id: user.user_id });
                if (!UserDocument)
                    return socket.emit(utils_1.default.EVENTS.Server.Create, { error: "An error occured" });
                UserDocument.servers.push(server.server_id); // add server to user
                yield UserDocument.save();
                // Emit to user that the server was created
                socket.emit(utils_1.default.EVENTS.Server.Create, { server, channel });
                // Emit to user the channel in the server
                socket.emit(utils_1.default.EVENTS.Channel.Join, channel);
            }
            catch (error) {
                logger_1.default.error(error);
                return socket.emit(utils_1.default.EVENTS.Server.Create, { error: "An error occured" });
            }
        });
    }
};
