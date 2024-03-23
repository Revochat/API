import User from "../../../database/models/User"
import bcrypt from "bcrypt"
import Message from "../../../database/models/Message"
import Channel from "../../../database/models/Channel"
import UTILS from "../../../utils"

export default {
    name: UTILS.EVENTS.User.RemoveFriend,
    description: "Remove a friend from your friend list",
    run: async function (socket: any, data: any) {
        try {
            if (!data.username) return socket.emit(UTILS.EVENTS.User.RemoveFriend, { error: "Missing username" });

            const friend = await User.findOne({ username: data.username });
            if (!friend) return socket.emit(UTILS.EVENTS.User.RemoveFriend, { error: "User not found" });

            const user = await User.findOne({ user_id: socket.revo.user.user_id });
            if (!user) return socket.emit(UTILS.EVENTS.User.RemoveFriend, { error: "User not found" });

            if (user.user_id === friend.user_id) return socket.emit(UTILS.EVENTS.User.RemoveFriend, { error: "You can't remove yourself" });

            const userRequestIndex = friend.friends_requests_received.findIndex((f: any) => f === user.user_id); // check if user has a friend request from friend and remove it

            // check if user has a friend request from friend and remove it
            const friendRequestIndex = user.friends_requests_received.findIndex((f: any) => f === friend.user_id);
            if (friendRequestIndex !== -1) {
                user.friends_requests_received.splice(friendRequestIndex, 1);
                friend.friends_requests_sent.splice(friend.friends_requests_sent.indexOf(user.user_id), 1);
                await user.save();
                await friend.save();
                
                socket.emit(UTILS.EVENTS.User.RemoveFriend, { success: `You removed ${friend.username} friend request` });

                socket.emit(UTILS.EVENTS.User.GetFriendRequestsSent, { user: user });
                socket.to(friend.user_id).emit(UTILS.EVENTS.User.GetFriendRequestsReceived, { user: friend }); // send the updated user to the friend
                
            } else if (userRequestIndex !== -1) { // check if friend has a friend request from user and remove it
                friend.friends_requests_received.splice(userRequestIndex, 1);
                user.friends_requests_sent.splice(user.friends_requests_sent.indexOf(friend.user_id), 1);
                await user.save();
                await friend.save();
                
                socket.emit(UTILS.EVENTS.User.RemoveFriend, { success: `You removed ${friend.username} friend request` });

                socket.emit(UTILS.EVENTS.User.GetFriends, { user: user });
                socket.to(friend.user_id).emit(UTILS.EVENTS.User.GetFriends, { user: friend }); // send the updated user to the friend
            } else { // they are friends, remove them from each other's friend list

                const friendIndex = user.friends.findIndex((f: any) => f === friend.user_id); 
                if (friendIndex === -1) return socket.emit(UTILS.EVENTS.User.RemoveFriend, { error: "This user is not your friend" });

                const userIndex = friend.friends.findIndex((f: any) => f === user.user_id);

                friend.friends.splice(userIndex, 1); // remove user from friend's friend list
                user.friends.splice(friendIndex, 1); // remove friend from user's friend list
                
                // get the channel between user and friend
                const channelToRemove = await Channel.findOne({ members: { $all: [user.user_id, friend.user_id] } });
                if (!channelToRemove) return socket.emit(UTILS.EVENTS.User.RemoveFriend, { error: "Channel not found" });

                // remove channel from user and friend
                user.channels.splice(user.channels.indexOf(channelToRemove.channel_id), 1);
                friend.channels.splice(friend.channels.indexOf(channelToRemove.channel_id), 1);

                // save changes
                await user.save();
                await friend.save();

                // delete all messages between user and friend
                await Message.deleteMany({ $or: [{ from: user.user_id, to: friend.user_id }, { from: friend.user_id, to: user.user_id }] });

                // remove channel from socket rooms
                socket.leave(channelToRemove.channel_id);
                socket.to(friend.user_id).leave(channelToRemove.channel_id);

                // remove channel from channels collection
                await Channel.findOneAndDelete({ channel_id: channelToRemove.channel_id });

                socket.emit(UTILS.EVENTS.User.RemoveFriend, { success: `You removed ${friend.username} from your friends` });
                socket.emit(UTILS.EVENTS.User.GetFriends, { user: user });
                socket.to(friend.user_id).emit(UTILS.EVENTS.User.GetFriends, { user: friend }); // send the updated user to the friend
            }

            // send the updated user to the user and the friend
            socket.emit(UTILS.EVENTS.User.GetFriends, { user: user });
            socket.to(friend.user_id).emit(UTILS.EVENTS.User.GetFriends, { user: friend }); // send the updated user to the friend
        } catch (error) {
            console.error("Error in remove.friend:", error);
            socket.emit(UTILS.EVENTS.User.RemoveFriend, { error: "Internal server error" });
            return socket;
        }
    }
};
