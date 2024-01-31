import User from "../../../database/models/User";
import Logger from "../../../logger";
import UTILS from "../../../utils";

export default {
    name: UTILS.EVENTS.User.GetFriends,
    description: "Get the friends of the user",
    run: async function (socket: any, data: any) {
        try {
            if(!socket.revo.logged) return socket.emit(UTILS.EVENTS.User.GetFriends, { error: "You are not logged in" });
            Logger.info(`[Socket] ${socket.revo.user.username} is trying to user.get ect to the server...`);
    
            const user = await User.findOne({ token: socket.revo.user.token }); // find the user
            if (!user) return socket.emit(UTILS.EVENTS.User.GetFriends, { error: "Invalid token" });
    
            // populate the friends
            
            // get user in the friends list
            const friends = await User.find({ _id: { $in: user.friends } }).populate("friends").exec();
            const friends_requests_received = await User.find({ _id: { $in: user.friends_requests_received } }).populate("friends_requests_received").exec();
            const friends_requests_sent = await User.find({ _id: { $in: user.friends_requests_sent } }).populate("friends_requests_sent").exec();

            Logger.info(`[Socket] ${friends} got their friends...`);

            socket.emit(UTILS.EVENTS.User.GetFriends, user ); // send a success message to the user
        } catch (error) {
            Logger.error(error)
            socket.emit(UTILS.EVENTS.User.GetFriends, {error:"An error occured"})
        }
    }
}