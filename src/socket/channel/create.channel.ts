import User from "../../database/models/User";
import Logger from "../../logger";
import Channel from "../../database/models/Channel";

export default {
    name: "channel.create",
    description: "create a channel",
    run: async function (socket: any, data: any) {
        if(!socket.revo.logged) return socket.emit("user.get", { error: "You are not logged in" });

        if(!data.name || !data.type) return socket.emit("channel.create", { error: "Missing parameters" });
        
        const user = socket.revo.user;

        const channel = await Channel.findOne({ channel_name: data.name, server_id: data.server_id });
        if(channel) return socket.emit("channel.create", { error: "Channel already exists" });

        const newChannel = new Channel({
            channel_name: data.name,
            channel_type: data.type,
            channel_category: data.category,
            server_id: data.server_id,
            owner_id: user.user_id,
            members: [user.user_id],
            members_count: 1
        });
    }
}