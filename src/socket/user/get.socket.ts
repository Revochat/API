import User from "../../database/models/User";
import Logger from "../../logger";
import UTILS from "../../utils";

export default {
    name: UTILS.EVENTS.User.Get,
    description: "user.get with socket",
    run: async function (socket: any, data: any) {
        try {
            if(!socket.revo.logged) return socket.emit(UTILS.EVENTS.User.Get, { error: "You are not logged in" });
            Logger.info(`[Socket] ${socket.revo.user.username} is trying to user.get ect to the server...`);
    
            const user = await User.findOne({ token: socket.revo.user.token }); // find the user
            if (!user) return socket.emit(UTILS.EVENTS.User.Get, { error: "Invalid token" });
    
            socket.emit(UTILS.EVENTS.User.Get, user ); // send a success message to the user
        } catch (error) {
            Logger.error(error)
            socket.emit(UTILS.EVENTS.User.Get, {error:"An error occured"})
        }
    }
}