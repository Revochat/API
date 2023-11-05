import User from "../../database/models/User";
import Logger from "../../logger";

export default {
    name: "conn",
    description: "Connect to the server",
    run: async function (socket: any, data: any) {
        if (!data.token) return socket.emit("conn", { error: "Missing token" });

        Logger.info(`[Socket] ${data.token} is trying to connect to the server...`);

        const user = await User.findOne({ token: data.token }); // find the user
        if (!user) return socket.emit("conn", { error: "Invalid token" });

        socket.emit("conn", { success: "Connected to the server !" }); // send a success message to the user
    }
}