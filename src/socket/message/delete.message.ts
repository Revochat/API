import User from "../../database/models/User";
import Message from "../../database/models/Message";
import Channel from "../../database/models/Channel";
import bcrypt from "bcrypt";
import UTILS from "../../utils";
import Logger from "../../logger";

export default {
    name: UTILS.EVENTS.Message.Delete,
    description: "Delete a message",
    run: async function (socket: any, data: any, e: any) {
        try {
            if (!socket.revo.logged) return socket.emit(UTILS.EVENTS.Message.Delete, { error: "You are not logged in" });

            if (!data || !data.message_id) return socket.emit(UTILS.EVENTS.Message.Delete, { error: "Please provide a message_id" });

            const user = socket.revo.user;

            const message = await Message.findOne({ message_id: data.message_id }); // find the message
            if (!message) return socket.emit(UTILS.EVENTS.Message.Delete, { error: "Message not found" });

            const channel = await Channel.findOne({ channel_id: message.channel_id }); // find the channel
            if (!channel) return socket.emit(UTILS.EVENTS.Message.Delete, { error: "Channel not found" });

            // Check if the user has permission to delete the message (check if it's their message or if they have permissions)
            if (message.user_id !== user.user_id) {
                // Check for permissions or additional criteria here, if applicable
                return socket.emit(UTILS.EVENTS.Message.Delete, { error: "You do not have permission to delete this message" });
            }

            await Message.deleteOne({ message_id: data.message_id }); // delete the message from the database

            Logger.info(`User ${user.username} deleted a message in channel ${channel.channel_id}`);

            socket.emit(UTILS.EVENTS.Message.Delete, { success: "Message deleted successfully" });
            socket.to(channel.channel_id).emit(UTILS.EVENTS.Message.Delete, { message_id: data.message_id }); // send notification to delete the message in the channel

            return socket
        } catch (error) {
            Logger.error(error);
            socket.emit(UTILS.EVENTS.Message.Delete, { error: "An error occured" });
        }
    }
};
