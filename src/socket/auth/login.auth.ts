import User from "../../database/models/User"

export default {
    name: "login",
    description: "Register a new user",
    run: async (socket: any, data: any) => {
        socket.to(socket.revo.socket_id).emit("register", "Hi client from server !" + data)
    }
}