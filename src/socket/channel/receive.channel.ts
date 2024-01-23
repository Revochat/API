import User from "../../database/models/User";
import Logger from "../../logger";
import Channel from "../../database/models/Channel";

export default {
    name: "channel.receive",
    description: "Receive information about a channel",
    run: async function (socket: any, data: any) {
        try {
            if (!socket.revo.logged) return socket.emit("channel.receive", { error: "You are not logged in" });
            if (!data.channel_id) return socket.emit("channel.receive", { error: "Missing channel_id" });

            const user = socket.revo.user; // get the user from the socket

            const userDocument = await User.findOne({ user_id: user.user_id }); // find the user document
            if (!userDocument) return socket.emit("channel.receive", { error: "User not found" });

            if (!userDocument.channels.includes(data.channel_id)) return socket.emit("channel.receive", { error: "You are not in this channel" });

            // get channel information
            const channel = await Channel.findOne({ channel_id: data.channel_id });
            if (!channel) return socket.emit("channel.receive", { error: "Channel not found" });

            Logger.info(`User ${user.username} (${user.user_id}) received information about channel ${data.channel_id}`);

            // send channel information to the socket
            socket.emit("channel.receive", { channel: channel });
        } catch (error) {
            Logger.error(error);
            socket.emit("channel.receive", { error: "An error occurred" });
        }
    }
}
