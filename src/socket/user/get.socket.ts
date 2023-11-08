import User from "../../database/models/User";
import Logger from "../../logger";

export default {
    name: "get.user",
    description: "get.user with socket",
    run: async function (socket: any, data: any) {
        console.log("aze")
        if (!data.token) return socket.emit("get.user ", { error: "Missing token" });

        Logger.info(`[Socket] ${data.token} is trying to get.user ect to the server...`);

        const user = await User.findOne({ token: data.token }); // find the user
        if (!user) return socket.emit("get.user ", { error: "Invalid token" });

        socket.emit("get.user ", { success: user }); // send a success message to the user
    }
}