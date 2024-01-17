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

            const user = await User.findOne({ user_id: socket.revo.user.user_id });
            if (!user) return socket.emit("remove.friend", { error: "User not found" });

            const friendIndex = user.friends.findIndex((f: any) => f === friend.user_id); 
            if (friendIndex === -1) return socket.emit("remove.friend", { error: "This user is not your friend" });

            const userIndex = friend.friends.findIndex((f: any) => f === user.user_id);
            if (userIndex === -1) return socket.emit("remove.friend", { error: "This user is not your friend" });

            friend.friends.splice(userIndex, 1); // remove user from friend's friend list
            user.friends.splice(friendIndex, 1); // remove friend from user's friend list

            console.log(user.channels)
            console.log(friend.channels)
            
            // get the channel between user and friend
            const channelToRemove = await Channel.findOne({ members: { $all: [user.user_id, friend.user_id] } });
            if (!channelToRemove) return socket.emit("remove.friend", { error: "Channel not found" });

            // remove channel from user and friend
            user.channels.splice(user.channels.indexOf(channelToRemove.channel_id), 1);
            friend.channels.splice(friend.channels.indexOf(channelToRemove.channel_id), 1);

            // save changes
            await user.save();
            await friend.save();

            // delete all messages between user and friend
            await Message.deleteMany({ $or: [{ from: user.user_id, to: friend.user_id }, { from: friend.user_id, to: user.user_id }] });

            // remove channel between user and friend
            socket.leave(friend.user_id);
            socket.leave(user.user_id);

            // remove channel from channels collection
            await Channel.findOneAndDelete({ channel_id: channelToRemove.channel_id });

            socket.emit("remove.friend", { success: `You removed ${friend.username} from your friends` });
            return socket;
            
        } catch (error) {
            console.error("Error in remove.friend:", error);
            socket.emit("remove.friend", { error: "Internal server error" });
            return socket;
        }
    }
};
