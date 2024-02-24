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
const Channel_1 = __importDefault(require("../../../database/models/Channel"));
const utils_1 = __importDefault(require("../../../utils"));
exports.default = {
    name: utils_1.default.EVENTS.User.AddFriend,
    description: "Add a friend to your friend list",
    run: function (socket, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!socket.revo.logged)
                    return socket.emit(utils_1.default.EVENTS.User.AddFriend, { error: "You are not logged in" });
                if (!data.username)
                    return socket.emit(utils_1.default.EVENTS.User.AddFriend, { error: "Missing username" });
                const user = socket.revo.user; // get the user from the socket
                const userDocument = yield User_1.default.findOne({ user_id: user.user_id }); // find the user document
                if (!userDocument)
                    return socket.emit(utils_1.default.EVENTS.User.AddFriend, { error: "User not found" });
                const friend = yield User_1.default.findOne({ username: data.username }); // find the friend
                if (!friend)
                    return socket.emit(utils_1.default.EVENTS.User.AddFriend, { error: "User not found" });
                if (userDocument.user_id === friend.user_id)
                    return socket.emit(utils_1.default.EVENTS.User.AddFriend, { error: "You can't add yourself as a friend" });
                if (userDocument.friends.includes(friend.user_id))
                    return socket.emit(utils_1.default.EVENTS.User.AddFriend, { error: "You are already friends with " + friend.username });
                if (userDocument.friends_requests_sent.includes(friend.user_id))
                    return socket.emit(utils_1.default.EVENTS.User.AddFriend, { error: "You already sent a friend request to " + friend.username });
                if (userDocument.friends_requests_received.includes(friend.user_id)) { // if the user has a friend request from the friend
                    userDocument.friends_requests_received.splice(userDocument.friends_requests_received.indexOf(friend.user_id), 1); // remove the friend request from the user
                    friend.friends_requests_sent.splice(friend.friends_requests_sent.indexOf(user.user_id), 1); // remove the friend request from the friend
                    userDocument.friends.push(friend.user_id); // add the friend to the user
                    friend.friends.push(user.user_id); // add the user to the friend
                    // create a channel for the user and the friend
                    const channel = yield Channel_1.default.create({
                        channel_name: "HYBRID_" + user.user_id + "_" + friend.user_id,
                        channel_category: "HYBRID",
                        members: [user.user_id, friend.user_id],
                    });
                    yield channel.save(); // save the channel document
                    userDocument.channels.push(channel.channel_id); // add the channel to the user
                    friend.channels.push(channel.channel_id); // add the channel to the friend
                    socket.to(friend.user_id).emit("channel.join", { channel: channel }); // send the channel to the friend
                    yield userDocument.save(); // save the user document
                    yield friend.save(); // save the friend document
                    socket.emit(utils_1.default.EVENTS.User.AddFriend, { success: "You are now friends with " + friend.username }); // send a success message to the user
                    socket.to(friend.user_id).emit(utils_1.default.EVENTS.User.AddFriend, { success: "You are now friends with " + user.username }); // send a success message to the friend
                }
                else { // if the user doesn't have a friend request from the friend
                    userDocument.friends_requests_sent.push(friend.user_id); // add the friend to the user's friend requests sent
                    friend.friends_requests_received.push(user.user_id); // add the user to the friend's friend requests received
                    yield userDocument.save(); // save the user document
                    yield friend.save(); // save the friend document
                    socket.emit(utils_1.default.EVENTS.User.AddFriend, { success: "You sent a friend request to " + friend.username }); // send a success message to the user
                    socket.to(friend.user_id).emit(utils_1.default.EVENTS.User.AddFriend, { success: user.username + " sent you a friend request" }); // send a success message to the friend
                }
                // send the updated user to the user and the friend
                socket.to(user.user_id).emit(utils_1.default.EVENTS.User.Update, { user: userDocument });
                socket.to(friend.user_id).emit(utils_1.default.EVENTS.User.Update, { user: friend }); // send the updated user to the friend
            }
            catch (error) {
                console.log(error);
                socket.emit(utils_1.default.EVENTS.User.AddFriend, { error: "Internal server error" });
            }
        });
    }
};
