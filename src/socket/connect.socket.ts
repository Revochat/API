import { Autoload } from "../autoload";

export default {
    name: "ping",
    description: "Ping the server!",
    run: (client: any) => {
        Autoload.socket.emit("pong", "Hi client from server !")
        console.log(client.revo)
    }
}