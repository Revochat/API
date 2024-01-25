import User from "../../database/models/User";
import Logger from "../../logger";
import Channel from "../../database/models/Channel";
import UTILS from "../../utils";
import Server from "../../database/models/Server";

// NOTE: DM CHANNELS ARE NOT CREATED HERE, THEY ARE CREATED WHEN A USER ADDS ANOTHER USER AS A FRIEND

export default {
    name: UTILS.EVENTS.Channel.Create,
    description: "create a channel in a server",
    run: async function (socket: any, data: any) {
        try {
            if(!socket.revo.logged) return socket.emit(UTILS.EVENTS.Channel.Create, { error: "You are not logged in" });
            if(!data.server_id) return socket.emit(UTILS.EVENTS.Channel.Create, { error: "Missing parameters" });
    
            const user = socket.revo.user; // get user from socket

            // check if user is in the server
            const server = await Server.findOne({ where: { id: data.server_id } });
            if(!server) return socket.emit(UTILS.EVENTS.Channel.Create, { error: "Server not found" });

            if(!server.members.includes(user.user_id)) return socket.emit(UTILS.EVENTS.Channel.Create, { error: "You are not in this server" });
            
            // check if user has permission to create a channel

            // create channel
            const channel = await Channel.create({
                channel_name: data.channel_name,
                channel_category: "SERVER",
                members: [user.user_id],

                server_id: server.server_id,
            });

            // send channel to socket
            socket.emit(UTILS.EVENTS.Channel.Create, { channel });
            socket.to(`server.${data.server}`).emit(UTILS.EVENTS.Channel.Create, { channel });
        } catch (error) {
            Logger.error(error);
            return socket.emit(UTILS.EVENTS.Channel.Create, { error: "An error occured" });
        }
    }
}