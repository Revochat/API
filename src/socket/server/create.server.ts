import User from "../../database/models/User";
import Logger from "../../logger";
import Channel from "../../database/models/Channel";
import UTILS from "../../utils";
import Server from "../../database/models/Server";
import Role from "../../database/models/Role";

export default {
    name: UTILS.EVENTS.Server.Create,
    description: "create a server",
    run: async function (socket: any, data: any) {
        try {
            if(!socket.revo.logged) return socket.emit(UTILS.EVENTS.Server.Create, { error: "You are not logged in" });

            if(!data.name) return socket.emit(UTILS.EVENTS.Server.Create, { error: "No name provided" });
    
            const user = socket.revo.user; // get user from socket

            // create server
            const server = await Server.create({
                server_name: data.name,
                owner_id: user.id,
                members: [{ user_id: user.id, roles: ["owner"] }],
                members_count: 1,
                roles: ['1', '2']
            });

            // create default roles
            const adminRole = await Role.create({
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

            const memberRole = await Role.create({
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

            // create channel for server
            const channel = await Channel.create({
                channel_name: data.name,
                channel_category: "SERVER",
                members: [user.user_id]
            });

            // add user to server
            const UserDocument = await User.findOne({ user_id: user.user_id });
            if(!UserDocument) return socket.emit(UTILS.EVENTS.Server.Create, { error: "An error occured" });

            UserDocument.servers.push(server.server_id); // add server to user
            await UserDocument.save();

            // Emit to user that the server was created
            socket.emit(UTILS.EVENTS.Server.Create, { server, channel });
            // Emit to user the channel in the server
            socket.emit(UTILS.EVENTS.Channel.Join, channel);
    
        } catch (error) {
            Logger.error(error);
            return socket.emit(UTILS.EVENTS.Server.Create, { error: "An error occured" });
        }
    }
}