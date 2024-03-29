"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventList = void 0;
var EventList;
(function (EventList) {
    let Message;
    (function (Message) {
        Message["Send"] = "message.send";
        Message["Delete"] = "message.delete";
    })(Message = EventList.Message || (EventList.Message = {}));
    let Channel;
    (function (Channel) {
        Channel["Create"] = "channel.create";
        Channel["Get"] = "channel.get";
        Channel["GetAll"] = "channel.get.all";
        Channel["Join"] = "channel.join";
    })(Channel = EventList.Channel || (EventList.Channel = {}));
    let User;
    (function (User) {
        User["Create"] = "user.create";
        User["Get"] = "user.get";
        User["GetChannels"] = "user.channels.get";
        User["GetFriends"] = "user.friends.get";
        User["GetFriendsList"] = "user.friends.list.get";
        User["GetFriendsReceivedList"] = "user.friends.received.list.get";
        User["GetFriendRequestsSent"] = "user.friend.requests.sent.get";
        User["GetFriendRequestsReceived"] = "user.friend.requests.received.get";
        User["Connect"] = "user.connect";
        User["AddFriend"] = "user.friend.add";
        User["RemoveFriend"] = "user.friend.remove";
        User["SetAvatar"] = "user.avatar.set";
    })(User = EventList.User || (EventList.User = {}));
    let Server;
    (function (Server) {
        Server["Create"] = "server.create";
        Server["Delete"] = "server.delete";
    })(Server = EventList.Server || (EventList.Server = {}));
})(EventList || (exports.EventList = EventList = {}));
