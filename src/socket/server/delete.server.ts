import User from "../../database/models/User";
import Logger from "../../logger";
import Channel from "../../database/models/Channel";
import UTILS from "../../utils";
import Server from "../../database/models/Server";
import Role from "../../database/models/Role";

export default {
    name: UTILS.EVENTS.Server.Delete,
    description: "Delete a server",
    run: async function (socket: any, data: any) {
        try {
            if (!socket.revo.logged) return socket.emit(UTILS.EVENTS.Server.Delete, { error: "You are not logged in" });
            if (!data.server_id) return socket.emit(UTILS.EVENTS.Server.Delete, { error: "Missing server_id" });

            const user = socket.revo.user; // get the user from the socket

            // get server information
            const server = await Server.findOne({ server_id: data.server_id });
            if (!server) return socket.emit(UTILS.EVENTS.Server.Delete, { error: "Server not found" });

            // check if the user is the owner of the server
            if (server.owner_id !== user.user_id) return socket.emit(UTILS.EVENTS.Server.Delete, { error: "You do not have permission to delete this server" });

            // delete server roles
            await Role.deleteMany({ role_server_id: data.server_id}, {role_id: { $nin: ["1", "2"] } }); // delete all roles except the default roles

            // remove server from users servers
            await User.updateOne({ user_id: user.user_id }, { $pull: { servers: data.server_id } }); // remove server from user servers

            // remove server from server collection
            await Server.deleteOne({ server_id: data.server_id });

            // remove channels from channel collection
            await Channel.deleteMany({ server_id: data.server_id });

            Logger.info(`User ${user.username} (${user.user_id}) deleted server ${data.server_id}`);

            // send notification to all members in the server
            socket.to(`server.${server.server_id}`).emit(UTILS.EVENTS.Server.Delete, { server_id: data.server_id });
            socket.emit(UTILS.EVENTS.Server.Delete, { success: "Server deleted successfully" });
        } catch (error) {
            Logger.error(error);
            socket.emit(UTILS.EVENTS.Server.Delete, { error: "An error occurred" });
        }
    }
};
