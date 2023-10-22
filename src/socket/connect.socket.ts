import { Autoload } from "../autoload";

export default {
    name: "connect",
    description: "Ping the server!",
    run: (client: any) => {
        Autoload.socket.emit("pong", "Hi client from server !")
    }
}