import User from "../../database/models/User";
import Logger from "../../logger";
import UTILS from "../../utils";

export default {
    name: UTILS.EVENTS.User.SetAvatar,
    description: "set the avatar of the user",
    run: async function (socket: any, data: any) {
        try {
            if(!socket.revo.logged) return socket.emit(UTILS.EVENTS.User.SetAvatar, { error: "You are not logged in" });
            Logger.info(`[Socket] ${socket.revo.user.username} is trying to user.get ect to the server...`);
    
            const user = await User.findOne({ token: socket.revo.user.token }); // find the user
            if (!user) return socket.emit(UTILS.EVENTS.User.SetAvatar, { error: "Invalid token" });
    
            user.avatar = data.avatar;
            await user.save();

            socket.emit(UTILS.EVENTS.User.SetAvatar, { user: user });
        } catch (error) {
            Logger.error(error)
            socket.emit(UTILS.EVENTS.User.SetAvatar, {error:"An error occured"})
        }
    }
}