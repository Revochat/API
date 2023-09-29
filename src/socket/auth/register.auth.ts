import User from "../../database/models/User"
import bcrypt from "bcrypt"
import UTILS from "../../utils"
import Logger from "../../logger"
export default {
    name: "register",
    description: "Register a new user",
    run: async (socket: any, data: any) => {
        if(!data) return socket.emit("register", "Please provide a username and a password")
        if(!data.username) return socket.emit("register", "Please provide a username")
        if(!data.password) return socket.emit("register", "Please provide a password")
        
        const asciiUsername = UTILS.VERIFY.STRING.default.ASCII(data.username)

        const user = await User.findOne({username: asciiUsername})

        if(user) return socket.emit("register", "This username is already taken")

        const newUser = await User.create({
            username: asciiUsername,
            password: await bcrypt.hash(data.password, 10),
            user_id: UTILS.GENERATE.USER.default.ID,
            identifier: asciiUsername,
            token: UTILS.GENERATE.USER.default.TOKEN,
            
            wallet_token: null,
            premium_expiration: null,
            avatar: "default",

            message_privacy: "everyone",
            status: "offline",
            updated_at: new Date(),
            created_at: new Date(),
            last_connection: new Date(),

            servers: [],
            channels: [],
            friends: [],
            friends_requests_received: [],
            friends_requests_sent: [],
            blocked: []
        })

        socket.revo.logged = true
        socket.revo.user = newUser

        Logger.info(`User ${newUser.username} has been created !`)

        socket.emit("register", "Your account has been created !")

        return socket
    }
}