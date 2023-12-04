export default {
    name: "user.remove.friend",
    description: "Remove a friend from your friend list",
    run: async function (socket: any, data: any) {
        if(!socket.revo.logged) return socket.emit("user.remove.friend", { error: "You are not logged in" });

    }
}