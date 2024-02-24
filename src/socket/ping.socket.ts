import { Autoload } from "../autoload";

export default {
    name: "ping",
    description: "Ping the server!",
    run: (socket: any) => {
        try {
            Autoload.socket.emit("ping", "pong, hi there!")
            return
        } catch (error) {
            console.log(error)
        }
    }
}