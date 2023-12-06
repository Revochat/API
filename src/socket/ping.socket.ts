import { Autoload } from "../autoload";

export default {
    name: "ping",
    description: "Ping the server!",
    run: (client: any) => {
        Autoload.socket.emit("ping", "pong, hi there!")
        console.log(client.revo)
    }
}