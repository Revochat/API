import User from "../../../database/models/User"
import bcrypt from "bcrypt"
import Message from "../../../database/models/Message"
import Channel from "../../../database/models/Channel"

export default {
    name: "remove.friend",
    description: "Remove a friend from your friend list",
    run: async function (socket: any, data: any) {
        try {
            if (!data.username) return socket.emit("remove.friend", { error: "Missing username" });

            const friend = await User.findOne({ username: data.username });
            if (!friend) return socket.emit("remove.friend", { error: "User not found" });

            const user = socket.revo.user;

            const UserDocument = await User.findOne({ user_id: user.user_id });
            if (!UserDocument) return socket.emit("remove.friend", { error: "User not found" });

            const friendIndex = user.friends.findIndex((f: any) => f === friend.user_id);
            if (friendIndex === -1) return socket.emit("remove.friend", { error: "This user is not your friend" });

            const userIndex = friend.friends.findIndex((f: any) => f === user.user_id);
            if (userIndex !== -1) {
                friend.friends.splice(userIndex, 1); // remove user from friend's friend list
                await friend.save(); // save changes
            }

            UserDocument.friends.splice(friendIndex, 1); // remove friend from user's friend list
            await UserDocument.save(); // save changes

            // delete all messages between user and friend
            await Message.deleteMany({ $or: [{ from: user.user_id, to: friend.user_id }, { from: friend.user_id, to: user.user_id }] });

            // remove channel between user and friend
            socket.leave(friend.user_id);
            socket.leave(user.user_id);

            // remove channel from user's channels and friend's channels
            console.log(user.channels, friend.channels);
            user.channels = user.channels.filter((channel: any) => channel !== friend.user_id);
            friend.channels = friend.channels.filter((channel: any) => channel !== user.user_id);

            // save changes
            await user.save();
            await friend.save();

            // remove channel from channels collection
            await Channel.findOneAndDelete({ channel_id: friend.user_id });

            socket.emit("remove.friend", { success: `You removed ${friend.username} from your friends` });
            return socket;
            
        } catch (error) {
            console.error("Error in remove.friend:", error);
            socket.emit("remove.friend", { error: "Internal server error" });
            return socket;
        }
    }
};
