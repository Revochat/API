import User from "../../database/models/User";
import Logger from "../../logger";
import Channel from "../../database/models/Channel";

export default {
    name: "channel.create",
    description: "create a channel",
    run: async function (socket: any, data: any) {
        try {
            if(!socket.revo.logged) return socket.emit("channel.create", { error: "You are not logged in" });

            if(!data.category) return socket.emit("channel.create", { error: "Missing parameters" });
    
            const user = socket.revo.user; // get user from socket
    
            // dm channel
            if (data.category === "DM" && data.friend_id) {
                if(!data.friend_id) return socket.emit("channel.create", { error: "Missing parameters" });
                
                // check if the friend exists
                const friend = await User.findOne({user_id: data.friend_id});
                if(!friend) return socket.emit("channel.create", { error: "User not found" });

                // check if the user is already friend with the friend
                const already_friend = user.friends.find((f: any) => f == friend.user_id);
                if (!already_friend) return socket.emit("channel.create", { error: "You are not friend with this user" });

                // check if the channel already exists
                const channel_exists = await Channel.findOne({ channel_id: "DM_" + user.user_id + "_" + friend.user_id });
                if (channel_exists) return socket.emit("channel.create", { error: "Channel already exists" });
    
                const channel = await Channel.create({
                    channel_id: "DM_" + user.user_id + "_" + friend.user_id,
                    channel_name: "DM_" + user.user_id + "_" + friend.user_id,
                    channel_category: "DM",
                    members: [user.user_id, friend.user_id],
                    updated_at: new Date().toLocaleString(),
                    created_at: new Date().toLocaleString(),
                });

                // save channel to user
                
                const UserDocument = await User.findOne({ where: { user_id: user.user_id } });
                if(!UserDocument) return socket.emit("channel.create", { error: "User not found" });

                UserDocument.channels.push(channel.channel_id);

                await UserDocument.save();

                // save channel to friend

                friend.channels.push(channel.channel_id);
                await friend.save();
    
                return socket.emit("channel.create", channel);
            }
    
            // server channel
            if (data.type === "SERVER" && data.server_id) {
                // if(!data.server_id) return socket.emit("channel.create", { error: "Missing parameters" });
    
                // const channel = await Channel.create({
                //     channel_id: "SERVER_" + data.server_id + "_" + data.name,
                //     channel_name: data.name,
                //     channel_category: "SERVER",
                //     members: [user.user_id],
                //     updated_at: new Date().toLocaleString(),
                //     created_at: new Date().toLocaleString(),
                //     server_id: data.server_id,
                // });
    
                // return socket.emit("channel.create", channel);
            }

            return socket.emit("channel.create", { error: "Invalid parameters" });
        } catch (error) {
            Logger.error(error);
            return socket.emit("channel.create", { error: "An error occured" });
        }
    }
}