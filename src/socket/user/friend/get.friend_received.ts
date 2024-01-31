import User from "../../../database/models/User";
import Logger from "../../../logger";
import UTILS from "../../../utils";

export default {
    name: UTILS.EVENTS.User.GetFriendsReceived,
    description: "Get the friends of the user",
    run: async function (socket: any, data: any) {
        try {
            if(!socket.revo.logged) return socket.emit(UTILS.EVENTS.User.GetFriendsReceived, { error: "You are not logged in" });
                
            const user = await User.findOne({ token: socket.revo.user.token }); // find the user
            if (!user) return socket.emit(UTILS.EVENTS.User.GetFriendsReceived, { error: "Invalid token" });
            
            // get user in the friends list
            const friends_requests_received = await User.find({ _id: { $in: user.friends_requests_received } }).populate("friends_requests_received").exec();

            // remove the password and token from the user
            friends_requests_received.forEach((user: any) => {
                user.password = undefined;
                user.token = undefined;
            });

            socket.emit(UTILS.EVENTS.User.GetFriendsReceived, { friends_requests_received });
        } catch (error) {
            Logger.error(error)
            socket.emit(UTILS.EVENTS.User.GetFriendsReceived, {error:"An error occured"})
        }
    }
}