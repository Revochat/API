"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../../database/models/User"));
const Message_1 = __importDefault(require("../../../database/models/Message"));
const Channel_1 = __importDefault(require("../../../database/models/Channel"));
const utils_1 = __importDefault(require("../../../utils"));
exports.default = {
    name: utils_1.default.EVENTS.User.RemoveFriend,
    description: "Remove a friend from your friend list",
    run: function (socket, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!data.username)
                    return socket.emit(utils_1.default.EVENTS.User.RemoveFriend, { error: "Missing username" });
                const friend = yield User_1.default.findOne({ username: data.username });
                if (!friend)
                    return socket.emit(utils_1.default.EVENTS.User.RemoveFriend, { error: "User not found" });
                const user = yield User_1.default.findOne({ user_id: socket.revo.user.user_id });
                if (!user)
                    return socket.emit(utils_1.default.EVENTS.User.RemoveFriend, { error: "User not found" });
                if (user.user_id === friend.user_id)
                    return socket.emit(utils_1.default.EVENTS.User.RemoveFriend, { error: "You can't remove yourself" });
                const userRequestIndex = friend.friends_requests_received.findIndex((f) => f === user.user_id); // check if user has a friend request from friend and remove it
                // check if user has a friend request from friend and remove it
                const friendRequestIndex = user.friends_requests_received.findIndex((f) => f === friend.user_id);
                if (friendRequestIndex !== -1) {
                    user.friends_requests_received.splice(friendRequestIndex, 1);
                    friend.friends_requests_sent.splice(friend.friends_requests_sent.indexOf(user.user_id), 1);
                    yield user.save();
                    yield friend.save();
                    socket.emit(utils_1.default.EVENTS.User.RemoveFriend, { success: `You removed ${friend.username} friend request` });
                }
                else if (userRequestIndex !== -1) { // check if friend has a friend request from user and remove it
                    friend.friends_requests_received.splice(userRequestIndex, 1);
                    user.friends_requests_sent.splice(user.friends_requests_sent.indexOf(friend.user_id), 1);
                    yield user.save();
                    yield friend.save();
                    socket.emit(utils_1.default.EVENTS.User.RemoveFriend, { success: `You removed ${friend.username} friend request` });
                }
                else { // they are friends, remove them from each other's friend list
                    const friendIndex = user.friends.findIndex((f) => f === friend.user_id);
                    if (friendIndex === -1)
                        return socket.emit(utils_1.default.EVENTS.User.RemoveFriend, { error: "This user is not your friend" });
                    const userIndex = friend.friends.findIndex((f) => f === user.user_id);
                    friend.friends.splice(userIndex, 1); // remove user from friend's friend list
                    user.friends.splice(friendIndex, 1); // remove friend from user's friend list
                    // get the channel between user and friend
                    const channelToRemove = yield Channel_1.default.findOne({ members: { $all: [user.user_id, friend.user_id] } });
                    if (!channelToRemove)
                        return socket.emit(utils_1.default.EVENTS.User.RemoveFriend, { error: "Channel not found" });
                    // remove channel from user and friend
                    user.channels.splice(user.channels.indexOf(channelToRemove.channel_id), 1);
                    friend.channels.splice(friend.channels.indexOf(channelToRemove.channel_id), 1);
                    // save changes
                    yield user.save();
                    yield friend.save();
                    // delete all messages between user and friend
                    yield Message_1.default.deleteMany({ $or: [{ from: user.user_id, to: friend.user_id }, { from: friend.user_id, to: user.user_id }] });
                    // remove channel between user and friend
                    socket.leave(friend.user_id);
                    socket.leave(user.user_id);
                    // remove channel from channels collection
                    yield Channel_1.default.findOneAndDelete({ channel_id: channelToRemove.channel_id });
                    socket.emit(utils_1.default.EVENTS.User.RemoveFriend, { success: `You removed ${friend.username} from your friends` });
                }
                // send the updated user to the user and the friend
                socket.to(user.user_id).emit(utils_1.default.EVENTS.User.Update, { user: user });
                socket.to(friend.user_id).emit(utils_1.default.EVENTS.User.Update, { user: friend }); // send the updated user to the friend
            }
            catch (error) {
                console.error("Error in remove.friend:", error);
                socket.emit(utils_1.default.EVENTS.User.RemoveFriend, { error: "Internal server error" });
                return socket;
            }
        });
    }
};
