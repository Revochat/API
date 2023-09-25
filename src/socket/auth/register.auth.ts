import User from "../../database/models/User"

export default {
    name: "register",
    description: "Register a new user",
    run: async (socket: any, data: any) => {
        if(!data) return socket.emit("register", "Please provide a username and a password")
        if(!data.username) return socket.emit("register", "Please provide a username")
        if(!data.password) return socket.emit("register", "Please provide a password")
        
        const user = await User.findOne({username: data.username})

        if(user) return socket.emit("register", "This username is already taken")

        // const newUser = new User({
        //     username: data.username,
        //     password: data.password
        // })

        socket.revo.logged = true
        socket.revo.user = {
            username: data.username,
            password: data.password
        }

        socket.emit("register", "Your account has been created !")

        return socket
    }
}