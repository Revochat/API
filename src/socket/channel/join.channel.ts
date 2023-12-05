import User from "../../database/models/User";
import Logger from "../../logger";
import Channel from "../../database/models/Channel";

export default {
    name: "channel.join",
    description: "join a channel",
    run: async function (socket: any, data: any) {
        if(!socket.revo.logged) return socket.emit("channel.join", { error: "You are not logged in" });

        if(!data.channel_id) return socket.emit("channel.join", { error: "Missing parameters" });

        socket.join(data.channel_id);
    }
}