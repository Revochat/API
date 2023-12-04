import User from "../../../database/models/User"
import bcrypt from "bcrypt"
import { RevoUser } from "../../../database/models/User";

export default {
    name: "user.friend.add",
    description: "Add a friend to your friend list",
    run: async function (socket: any, data: any) {
        try {
            if(!data.friend_id) return socket.emit("user.friend.add", { error: "Missing friend_id" });

            const user = socket.revo.user; // get the user from the socket
    
            if(!user) return socket.emit("user.friend.add", { error: "You are not logged in" });
    
            const friend = await User.findOne({ user_id: data.friend_id }); // find the friend
            if(!friend) return socket.emit("user.friend.add", { error: "User not found" });
    
            // check if user is already friend with the friend
            const already_friend = user.friends.find((f: any) => f.user_id == friend.user_id);
            if (already_friend) return socket.emit("user.friend.add", { error: "You are already friend with this user" });
    
            if(user.user_id == friend.user_id) return socket.emit("user.friend.add", { error: "You can't add yourself" });
    
            const friend_already_added = user.friends.find((f: any) => f.user_id == friend.user_id);
            if(friend_already_added) return socket.emit("user.friend.add", { error: "This user is already your friend" });
    
            // check if the user already blocked the friend
            const friend_blocked = user.blocked.find((f: any) => f.user_id == friend.user_id);
            const user_blocked = friend.blocked.find((f: any) => f.user_id == user.user_id);
            if(friend_blocked || user_blocked) return socket.emit("user.friend.add", { error: "You can't add this user" });
    
            // check if the user already sent a friend request to the friend
            const friend_request_sent = user.friends_requests_sent.find((f: any) => f == friend.user_id);
            if(friend_request_sent) return socket.emit("user.friend.add", { error: "You already sent a friend request to this user" });
    
            // check if the friend already sent a friend request to the user
            const friend_request_received = user.friends_requests_received.find((f: any) => f == friend.user_id);
            if(friend_request_received) {
                // accept the friend request
                user.friends_requests_received = user.friends_requests_received.filter((f: any) => f != friend.user_id);
                friend.friends_requests_sent = friend.friends_requests_sent.filter((f: any) => f != user.user_id);

                const UserDocument = await User.findOne({ user_id: user.user_id }); // find the user document
                if(!UserDocument) return socket.emit("user.friend.add", { error: "User not found" });

                UserDocument.friends.push(parseInt(friend.user_id));
                await UserDocument.save();

                friend.friends.push(parseInt(user.user_id));
                await friend.save();

                return socket.emit("user.friend.add", { success: "You are now friend with " + friend.username }); // send a success message to the user
            } else {
                // send a friend request
                user.friends_requests_sent.push(friend.user_id);
                friend.friends_requests_received.push(user.user_id);
                await user.save();
                await friend.save();
            }
    
            return socket.emit("user.friend.add", { success: "You sent a friend request to " + friend.username }); // send a success message to the user
        }
        catch (error) {
            console.log(error)
            socket.emit("user.friend.add", { error: "Internal server error" });
        }
    }
}