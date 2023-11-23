import User from "../../database/models/User";
import Logger from "../../logger";
import Channel from "../../database/models/Channel";

export default {
    name: "channel.create",
    description: "create a channel",
    run: async function (socket: any, data: any) {
        if(!socket.revo.logged) return socket.emit("user.get", { error: "You are not logged in" });

        if(!data.name || !data.type) return socket.emit("channel.create", { error: "Missing parameters" });
        
        if(data.category != "DM" && data.category != "GROUP" && data.category != "SERVER") return socket.emit("channel.create", { error: "Invalid category" });
        if(data.type != "HYBRID" && data.type != "TEXT" && data.type != "VOICE") return socket.emit("channel.create", { error: "Invalid type" });

        const user = socket.revo.user; // get user from socket

        if(data.friend_id && data.category == "DM") { // if it is a DM channel
            const friend = await User.findOne({ user_id: data.friend_id });
            if(!friend) return socket.emit("channel.create", { error: "Friend not found" });

            const channel = await Channel.findOne({ channel_name: data.name, server_id: data.server_id });
            if(channel) return socket.emit("channel.create", { error: "Channel already exists" });
    
            const newChannel = new Channel({
                channel_name: data.name,
                channel_type: data.type,
                channel_category: data.category,
                server_id: data.server_id,
                owner_id: user.user_id,
                members: [user.user_id, friend.user_id],
                members_count: 2
            });

            await newChannel.save();

            socket.emit("channel.create", { success: "Channel created" });
            socket.emit("get.channel", { channel_id: newChannel.channel_id }); // update channel list for the user and his friend
        }

        // await newChannel.save();

        // socket.emit("channel.create", { success: "Channel created" }); 

        // Logger.info(`${user.username} created a channel ${data.name} in server ${data.server_id}`);

        // socket.emit("get.channel", { channel_id: newChannel.channel_id }); // update channel list

        // socket.emit("server.get", { server_id: data.server_id }); // update server channels if it is a server channel
    }
}