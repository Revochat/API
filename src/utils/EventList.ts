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
        Connect = "user.connect",
        AddFriend = "user.friend.add",
        RemoveFriend = "user.friend.remove",
        SetAvatar = "user.avatar.set",
        Update = "user.update",
    }

    export enum Server {
        Create = "server.create",
        Delete = "server.delete",
    }
}