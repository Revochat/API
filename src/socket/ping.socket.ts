import { Autoload } from "../autoload";

export default {
    name: "ping",
    description: "Ping the server!",
    run: (client: any) => {
        try {
            Autoload.socket.emit("ping", "pong, hi there!")
            console.log(client.revo)
        } catch (error) {
            console.log(error)
        }
    }
}