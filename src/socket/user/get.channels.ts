import User from "../../database/models/User";
import Logger from "../../logger";
import UTILS from "../../utils";

export default {
    name: UTILS.EVENTS.User.GetChannelList,
    description: "Get the user's channels",
    run: async function (socket: any, data: any) {
        try {
            if(!socket.revo.logged) return socket.emit(UTILS.EVENTS.User.Get, { error: "You are not logged in" });
            Logger.info(`[Socket] ${socket.revo.user.username} is trying to user.get ect to the server...`);
    
            const user = await User.findOne({ token: socket.revo.user.token }); // find the user
            if (!user) return socket.emit(UTILS.EVENTS.User.Get, { error: "Invalid token" });

            // get the user's channels with aggregate
            const channels = await User.aggregate([
                { $match: { token: socket.revo.user.token } },
                { $unwind: "$channels" },
                { $lookup: { from: "channels", localField: "channels", foreignField: "_id", as: "channels" } },
                { $unwind: "$channels" },
                { $project: { _id: 0, channels: 1 } }
            ]);

            user.channels = channels.map((channel: any) => channel.channels); // set the user's channels
    
            socket.emit(UTILS.EVENTS.User.GetChannelList, user ); // send a success message to the user
        } catch (error) {
            Logger.error(error)
            socket.emit(UTILS.EVENTS.User.GetChannelList, {error:"An error occured"})
        }
    }
}