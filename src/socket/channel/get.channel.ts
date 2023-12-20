import User from "../../database/models/User";
import Logger from "../../logger";
import Channel from "../../database/models/Channel";
import Message from "../../database/models/Message";

export default {
    name: "channel.get",
    description: "get a channel",
    run: async function (socket: any, data: any) {
        if(!socket.revo.logged) return socket.emit("channel.get", { error: "You are not logged in" });

        if(!data.channel_id) return socket.emit("channel.get", { error: "Missing channel_id" });

        const user = socket.revo.user; // get the user from the socket

        const userDocument = await User.findOne({ user_id: user.user_id }); // find the user document
        if (!userDocument) return socket.emit("channel.get", { error: "User not found" });

        if(!userDocument.channels.includes(data.channel_id)) return socket.emit("channel.get", { error: "You are not in this channel" });

        // get the last 50 messages from the channel
        const limit = data.limit ? data.limit : 50;
        const messages = await Message.find({ channel_id: data.channel_id }).sort({ created_at: -1 }).limit(limit);

        messages.reverse(); // reverse the messages array so the newest messages are at the bottom

        Logger.info(`User ${user.username} (${user.user_id}) got ${messages.length} messages from channel ${data.channel_id}`)

        // populate the messages with the user data
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            const author = await User.findOne({ user_id: message.user_id });
            if (!author) return socket.emit("channel.get", { error: "An error occured" });
            message.user_id = author;
        }

        socket.emit("channel.get", { messages: messages });
    }
}