import User from "../../database/models/User";
import Logger from "../../logger";
import Channel from "../../database/models/Channel";
import UTILS from "../../utils";

// NOTE: DM CHANNELS ARE NOT CREATED HERE, THEY ARE CREATED WHEN A USER ADDS ANOTHER USER AS A FRIEND

export default {
    name: "channel.create",
    description: "create a channel in a server",
    run: async function (socket: any, data: any) {
        try {
            if(!socket.revo.logged) return socket.emit("channel.create", { error: "You are not logged in" });

            if(!data.category) return socket.emit("channel.create", { error: "Missing parameters" });
    
            const user = socket.revo.user; // get user from socket
    
        } catch (error) {
            Logger.error(error);
            return socket.emit("channel.create", { error: "An error occured" });
        }
    }
}