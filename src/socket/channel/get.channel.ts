import User from "../../database/models/User";
import Logger from "../../logger";
import Channel from "../../database/models/Channel";
import Message from "../../database/models/Message";
import UTILS from "../../utils";

export default {
    name: UTILS.EVENTS.Channel.Get,
    description: "get a channel",
    run: async function (socket: any, data: any) {
        try {
            if(!socket.revo.logged) return socket.emit(UTILS.EVENTS.Channel.Get, { error: "You are not logged in" });

            if(!data.channel_id) return socket.emit(UTILS.EVENTS.Channel.Get, { error: "Missing channel_id" });
    
            const user = socket.revo.user; // get the user from the socket
    
            const userDocument = await User.findOne({ user_id: user.user_id }); // find the user document
            if (!userDocument) return socket.emit(UTILS.EVENTS.Channel.Get, { error: "User not found" });
    
            if(!userDocument.channels.includes(data.channel_id)) return socket.emit(UTILS.EVENTS.Channel.Get, { error: "You are not in this channel" });
    
            // get the last 50 messages from the channel
            const limit = data.limit ? data.limit : 25;
            const messages: any = await Message.find({ channel_id: data.channel_id }).sort({ createdAt: -1 }).limit(limit);
    
            messages.reverse(); // reverse the messages array so the newest messages are at the bottom
    
            Logger.info(`User ${user.username} (${user.user_id}) got ${messages.length} messages from channel ${data.channel_id}`)
    
            // populate the messages with the user data
            for (let i = 0; i < messages.length; i++) {
                const message = messages[i];
                const author = await User.findOne({ user_id: message.user_id });
                if (!author) return socket.emit(UTILS.EVENTS.Channel.Get, { error: "An error occured" });
    
                messages[i] = messages[i].toObject(); 
                messages[i].user = author.toObject();
    
                delete messages[i].user.password;
                delete messages[i].user.token;
            }
    
            socket.emit(UTILS.EVENTS.Channel.Get, { messages: messages });
        } catch (error) {
            Logger.error(error)
            socket.emit(UTILS.EVENTS.Channel.Get, {error:"An error occured"})
        }
    }
}