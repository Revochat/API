import User from "../../../database/models/User"
import bcrypt from "bcrypt"

export default {
    name: "remove.friend",
    description: "Remove a friend from your friend list",
    run: async function (socket: any, data: any) {
        try {
        if (!data.friend_id) return socket.emit("remove.friend", { error: "Missing friend_id" });

        const friend = await User.findOne({ user_id: data.friend_id });
        if (!friend) return socket.emit("remove.friend", { error: "User not found" });

        const user = socket.revo.user;
        console.log(user);

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

        socket.emit("remove.friend", { success: `You removed ${friend.username} from your friends` });
        return socket;
    }
    catch (error) {
        console.error("Error in remove.friend:", error);
        socket.emit("remove.friend", { error: "Internal server error" });
        return socket;
    }
    }
};
