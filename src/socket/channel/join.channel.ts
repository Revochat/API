import User from "../../database/models/User";
import Logger from "../../logger";
import Channel from "../../database/models/Channel";
import UTILS from "../../utils";

export default {
    name: UTILS.EVENTS.Channel.Join,
    description: "join a channel",
    run: async function (socket: any, data: any) {
        try {
            if(!socket.revo.logged) return socket.emit(UTILS.EVENTS.Channel.Join, { error: "You are not logged in" });

            if(!data.channel_id) return socket.emit(UTILS.EVENTS.Channel.Join, { error: "Missing parameters" });
    
            // check if channel exists
            const channel = await Channel.findOne({ channel_id: data.channel_id });
            if(!channel) return socket.emit(UTILS.EVENTS.Channel.Join, { error: "Channel not found" });
    
            socket.join(data.channel_id);
        } catch (error) {
            Logger.error(error)
            socket.emit(UTILS.EVENTS.Channel.Join, {error:"An error occured"})
        }
    }
}