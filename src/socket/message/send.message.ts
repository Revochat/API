import User from "../../database/models/User"
import Message from "../../database/models/Message"
import Channel from "../../database/models/Channel"
import bcrypt from "bcrypt"
import UTILS from "../../utils"
import Logger from "../../logger"

export default {
    name: "message.send",
    description: "Send a message",
    run: async function (socket: any, data: any, e : any) {
        try {
            if(!socket.revo.logged) return socket.emit("message.send", { error: "You are not logged in" });

            if(!data) return socket.emit("message.send", "Please provide a message")
            if(!data.message) return socket.emit("message.send", "Please provide a message")
            if(!data.channel_id) return socket.emit("message.send", "Please provide a channel id")
            
            const user = socket.revo.user
    
            const channel = await Channel.findOne({channel_id: data.channel_id}) // check if the channel exists
            if(!channel) return socket.emit("message.send", "This channel doesn't exist")
    
            // check if the user is in the channel
            if(!channel.members.includes(user.user_id)) return socket.emit("message.send", "This user isn't in this channel")
    
            var message: any = await Message.create({ // create the message
                message_id: Date.now() + Math.floor(Math.random() * 100000),
                user_id: user.user_id,
                channel_id: channel.channel_id,
                message: data.message,
                created_at: new Date()
            })
    
            Logger.info(`User ${user.username} sent a message in channel ${channel.channel_id}`)
    

            // populate the messages with the user data
            const author = await User.findOne({ user_id: message.user_id });
            if (!author) return socket.emit("message.send", { error: "An error occured" });

            message = message.toObject(); 
            message.user = author.toObject();

            delete message.user.password;
            delete message.user.token;
    
            socket.emit("message.send", {message}) // send the message to the sender
            socket.to(channel.channel_id).emit("message.send", {message}) // send the message to the channel
            
            return socket
        }
        catch (error) {
            Logger.error(error)
            return socket.emit("message.send", { error: "An error occured" });
        }
    }
}