export namespace EventList {
    
    export enum Message {
        Send = "message.send",
        Delete = "message.delete"
    }

    export enum Channel {
        Create = "channel.create",
        Get = "channel.get",
        Join = "channel.join",
    }

    export enum User {
        Create = "user.create",
        Get = "user.get",
        GetFriends = "user.friends.get",
        GetFriendsReceived = "user.friends.received.get",
        Connect = "user.connect",
        AddFriend = "user.friend.add",
        RemoveFriend = "user.friend.remove",
        SetAvatar = "user.avatar.set",
    }

    export enum Server {
        Create = "server.create",
        Delete = "server.delete",
    }
}