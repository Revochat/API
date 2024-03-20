import Channel from "../../../database/models/Channel";
import User from "../../../database/models/User";
import Logger from "../../../logger";
import UTILS from "../../../utils";
import Message from "../../../database/models/Message";

export default {
    name: UTILS.EVENTS.User.GetFriendsList,
    description: "Get the user's friends list",
    run: async function (socket: any, data: any) {
        try {
            if(!socket.revo.logged) return socket.emit(UTILS.EVENTS.User.GetFriendsList, { error: "You are not logged in" });
            Logger.info(`[Socket] ${socket.revo.user.username} is trying to get their channels`)
    
            const user = await User.findOne({ token: socket.revo.user.token }); // find the user
            if (!user) return socket.emit(UTILS.EVENTS.User.GetFriendsList, { error: "Invalid token" });

            const friends = await User.find({ user_id: { $in: user.friends } });
            if (!friends) return socket.emit(UTILS.EVENTS.User.GetFriendsList, { error: "No friends found" });

            for (let i = 0; i < friends.length; i++) {
                friends[i] = UTILS.removeSensitiveData(friends[i]);
            }

            socket.emit(UTILS.EVENTS.User.GetFriendsList, friends);
        } catch (error) {
            Logger.error(error)
            socket.emit(UTILS.EVENTS.User.GetFriendsList, {error:"An error occured"})
        }
    }
}