import { Autoload } from "../autoload";

export default {
    name: "hello",
    description: "Ping the server!",
    run: (socket: any, message: any) => {
        console.log("I'm here !")
        console.log(message)
        socket.join("room1")
        console.log(socket.id)
       socket.emit("pong", `${message} from server ! ${socket.id}`)
       socket.to("room1").emit("pong", `${message} from server 222! ${socket.id}`)
    }
}