import User from "../../../database/models/User"
import bcrypt from "bcrypt"

export default {
    name: "login",
    description: "Login to the server",
    run: async function (socket: any, data: any) {
        if(!data.username || !data.password) return socket.emit("login", { error: "Missing username or password" });

        const user = await User.findOne({ username: data.username });

        if(!user) return socket.emit("login", { error: "User not found" });

        const password = await bcrypt.compare(data.password, user.password);

        if(!password) return socket.emit("login", { error: "Invalid password" });
    
        socket.revo.logged = true;
        socket.revo.user = user;
        socket.emit("login", { success: "You are now logged in" });

        return socket;
    }
}