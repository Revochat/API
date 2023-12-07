import User from "../../../database/models/User"
import bcrypt from "bcrypt"
import { RevoUser } from "../../../database/models/User";

export default {
    name: "remove.friend",
    description: "Remove a friend from your friend list",
    run: async function (socket: any, data: any) {
        if(!data.friend_id) return socket.emit("remove.friend", { error: "Missing friend_id" });

        const friend = await User.findOne({ user_id: data.friend_id }); // trouve "friend"
        if(!friend) return socket.emit("remove.friend", { error: "User not found" });

        const user = socket.revo.user; // recupere la socket de l'utilisateur

        const friendIndex = user.friends.findIndex((f: any) => f.user_id === friend.user_id);
        if(friendIndex === -1) return socket.emit("remove.friend", { error: "This user is not your friend" });

        user.friends.splice(friendIndex, 1); // enleve l'ami de la liste d'amis de l'utilisateur

        const userIndex = friend.friends.findIndex((f: any) => f.user_id === user.user_id);
        if(userIndex !== -1) {
            friend.friends.splice(userIndex, 1); // enleve l'utilisateur de la liste d'amis de l'ami
            await friend.save(); // enregistre les changements de l'ami
        }

        await user.save(); // enregistre les changements de l'utilisateur

        socket.emit("remove.friend", { success: `You removed ${friend.username} from your friends` }); // envoie un message de succes a l'utilisateur
        return socket;
    }
}
