import User from "../database/models/User"

export default {
    name: "hello",
    description: "Ping the server!",
    run: async (socket: any, message: any) => {
        console.log(socket.revo)
    }
}