import Channel from "../../database/models/Channel";
import User from "../../database/models/User";
import Logger from "../../logger";
import UTILS from "../../utils";
import Message from "../../database/models/Message";

export default {
    name: UTILS.EVENTS.User.GetChannels,
    description: "Get the user's channels",
    run: async function (socket: any, data: any) {
        try {
            if(!socket.revo.logged) return socket.emit(UTILS.EVENTS.User.Get, { error: "You are not logged in" });
            Logger.info(`[Socket] ${socket.revo.user.username} is trying to get their channels`)
    
            const user = await User.findOne({ token: socket.revo.user.token }); // find the user
            if (!user) return socket.emit(UTILS.EVENTS.User.Get, { error: "Invalid token" });

            let channels = [];
            for (let i = 0; i < user.channels.length; i++) {
                const channel = await Channel.findOne({ _id: user.channels[i] });
                if (channel) {
                    // get the users from the channel
                    let users = [];
                    for (let j = 0; j < channel.members.length; j++) {
                        const user = await User.findOne({ _id: channel.members[j] });
                        if (user) {
                            users.push({
                                username: user.username,
                                user_id: user._id,
                                avatar: user.avatar,
                                status: user.status
                            });
                        }
                    }
                    // get last message from channel
                    let lastMessage = null;
                    // get number of messages in message collection
                    const messages = await Message.find({ channel_id: channel._id }).sort({ createdAt: -1 }).limit(1);
                    if (messages.length > 0) {
                        lastMessage = messages[0];
                        lastMessage = lastMessage.toObject();
                    }

                    // sort channels by last message date (newest first)
                    // channels.sort((a, b) => {
                    //     if (!a.lastMessage || !b.lastMessage) return 0;
                    //     if (a.lastMessage.createdAt > b.lastMessage.createdAt) return -1;
                    //     if (a.lastMessage.createdAt < b.lastMessage.createdAt) return 1;
                    //     return 0;
                    // });

                    channels.push({
                        channel_id: channel._id,
                        name: channel.channel_name,
                        members: users,
                        lastMessage: lastMessage
                    });
                }
            }
    
            socket.emit(UTILS.EVENTS.User.GetChannels, channels);
        } catch (error) {
            Logger.error(error)
            socket.emit(UTILS.EVENTS.User.GetChannels, {error:"An error occured"})
        }
    }
}