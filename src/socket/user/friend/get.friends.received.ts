import Channel from "../../../database/models/Channel";
import User from "../../../database/models/User";
import Logger from "../../../logger";
import UTILS from "../../../utils";
import Message from "../../../database/models/Message";

export default {
    name: UTILS.EVENTS.User.GetFriendsReceivedList,
    description: "Get the user's friends received list",
    run: async function (socket: any, data: any) {
        try {
            if(!socket.revo.logged) return socket.emit(UTILS.EVENTS.User.GetFriendsReceivedList, { error: "You are not logged in" });
            Logger.info(`[Socket] ${socket.revo.user.username} is trying to get their channels`)
    
            const user = await User.findOne({ token: socket.revo.user.token }); // find the user
            if (!user) return socket.emit(UTILS.EVENTS.User.GetFriendsReceivedList, { error: "Invalid token" });

            const friends_received = await User.find({ user_id: { $in: user.friends_requests_received } });

            if (!friends_received) return socket.emit(UTILS.EVENTS.User.GetFriendsReceivedList, { error: "No friends found" });

            for (let i = 0; i < friends_received.length; i++) {
                friends_received[i] = UTILS.removeSensitiveData(friends_received[i]);
            }

            socket.emit(UTILS.EVENTS.User.GetFriendsReceivedList, friends_received);
        } catch (error) {
            Logger.error(error)
            socket.emit(UTILS.EVENTS.User.GetFriendsReceivedList, {error:"An error occured"})
        }
    }
}