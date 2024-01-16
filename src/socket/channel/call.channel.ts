import User from "../../database/models/User";
import Logger from "../../logger";
import Channel from "../../database/models/Channel";

export default {
    name: "channel.call",
    description: "call a channel",
    run: async function (socket: any, data: any) {
        if(!socket.revo.logged) return socket.emit("channel.call", { error: "You are not logged in" });

        if(!data.channel_id) return socket.emit("channel.call", { error: "Missing parameters" });

        // check if channel exists
        const channel = await Channel.findOne({ channel_id: data.channel_id });
        if(!channel) return socket.emit("channel.call", { error: "Channel not found" });

        // check if channel is a call channel
        if(channel.channel_category != "AUDIO" && channel.channel_category != "HYBRID") return socket.emit("channel.call", { error: "Channel is not a call channel" });

        // push user id to call list
        // channel.call.call_list.push(socket.revo.user_id);
        // await channel.save();

        // send call event to all users in call
        socket.to(data.channel_id).emit("channel.call", { user_id: socket.revo.user_id }); // send call event to all users in call so that they can add the user
    }
}