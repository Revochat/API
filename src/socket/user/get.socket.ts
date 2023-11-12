import User from "../../database/models/User";
import Logger from "../../logger";

export default {
    name: "user.get",
    description: "user.get with socket",
    run: async function (socket: any, data: any) {
        if(!socket.revo.logged) return socket.emit("user.get", { error: "You are not logged in" });
        Logger.info(`[Socket] ${socket.revo.user.username} is trying to user.get ect to the server...`);

        const user = await User.findOne({ token: socket.revo.user.token }); // find the user
        if (!user) return socket.emit("user.get", { error: "Invalid token" });

        socket.emit("user.get", user ); // send a success message to the user
    }
}