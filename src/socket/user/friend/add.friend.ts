import User from "../../../database/models/User"
import bcrypt from "bcrypt"
import { RevoUser } from "../../../database/models/User";

export default {
    name: "add.friend",
    description: "Add a friend to your friend list",
    run: async function (socket: any, data: any) {
        if(!data.friend_id) return socket.emit("add.friend", { error: "Missing friend_id" });

        const friend = await User.findOne({ user_id: data.friend_id }); // find the friend
        if(!friend) return socket.emit("add.friend", { error: "User not found" });

        console.log(socket.revo.user)
        const user = socket.revo.user; // get the user from the socket
        console.log(user.user_id, friend.user_id)
        if(user.user_id == friend.user_id) return socket.emit("add.friend", { error: "You can't add yourself" });

        const friend_already_added = user.friends.find((f: any) => f.user_id == friend.user_id);
        if(friend_already_added) return socket.emit("add.friend", { error: "This user is already your friend" });

        // check if the user already blocked the friend
        const friend_blocked = user.blocked.find((f: any) => f.user_id == friend.user_id);
        const user_blocked = friend.blocked.find((f: any) => f.user_id == user.user_id);
        if(friend_blocked || user_blocked) return socket.emit("add.friend", { error: "You can't add this user" });


        // check if the user already sent a friend request to the friend
        const friend_request_sent = user.friends_requests_sent.find((f: any) => f.user_id == friend.user_id);

        // check if the friend already sent a friend request to the user
        const friend_request_received = user.friends_requests_received.find((f: any) => f.user_id == friend.user_id);

        // if the user already sent a friend request to the friend or the friend already sent a friend request to the user then accept the friend request
        if(friend_request_sent || friend_request_received) {
            user.friends_requests_sent = user.friends_requests_sent.filter((f: any) => f.user_id != friend.user_id); // remove the friend request from the user
            user.friends_requests_received = user.friends_requests_received.filter((f: any) => f.user_id != friend.user_id); // remove the friend request from the friend

            user.friends.push(friend.user_id); // add the friend to the user
            friend.friends.push(user.user_id); // add the user to the friend

            await friend.save(); // save the friend
            await user.save();

            socket.emit("add.friend", { success: "You accepted the friend request" }); // send a success message to the user

            return socket;
        }

        return socket.emit("add.friend", { success: "You sent a friend request to " + friend.username }); // send a success message to the user
    }
}