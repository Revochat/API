export namespace EventList {
    
    export enum Message {
        Send = "message.send",
        Delete = "message.delete"
    }

    export enum Channel {
        Create = "channel.create",
        Receive = "channel.receive",
        Delete = "channel.delete",
        Error = "channel.error",
        Get = "channel.get",
        Listen = "channel.listen",
        Join = "channel.join",
    }

    export enum User {
        Create = "user.create",
        Delete = "user.delete",
        Error = "user.error",
        Get = "user.get",
        Connect = "user.connect",
        AddFriend = "user.friend.add",
        RemoveFriend = "user.friend.add",
    }

    export enum Server {
        Error = "server.error",
        Create = "server.create",
    }

    export namespace Error {
        export enum Message {
            ChannelNotFound = "Channel Not Found",
            UserNotFound = "User Not Found",
            MessageNotFound = "Message Not Found",
            NotAllowed = "Not Allowed",
            NotConnected = "Not Connected",
            NotInChannel = "Not In Channel",
            NotOwner = "Not Owner",
            NotFriend = "Not Friend",
            NotInServer = "Not In Server",
            NotInGroup = "Not In Group",
            NotInPrivate = "Not In Private",
            NotInPublic = "Not In Public",
            NotInDM = "Not In DM",
            NotInGuild = "Not In Guild",
            NotInTeam = "Not In Team",
            NotInVoice = "Not In Voice",
            NotInText = "Not In Text",
            NotInCategory = "Not In Category"
        }
        export enum Channel {
            NotFound = "Channel Not Found",
            NotAllowed = "Not Allowed",
            NotInChannel = "Not In Channel",
            NotOwner = "Not Owner",
        }
        export enum User {
            NotFriend = "Not Friend",
            NotInServer = "Not In Server",
            NotInGroup = "Not In Group",
            NotInPrivate = "Not In Private",
            NotInPublic = "Not In Public",
            NotInDM = "Not In DM",
            NotInGuild = "Not In Guild",
            NotInTeam = "Not In Team",
            NotInVoice = "Not In Voice",
            NotInText = "Not In Text",
            NotInCategory = "Not In Category",
            Blocked = "Blocked",
            NotBlocked = "Not Blocked",
            NotAllowed = "Not Allowed",
            NotConnected = "Not Connected",
            NotInChannel = "Not In Channel",
            NotOwner = "Not Owner",
            NotFound = "User Not Found",
        }
        export enum Server {
            NotFound = "Server Not Found",
            NotAllowed = "Not Allowed",
            NotInServer = "Not In Server",
            NotOwner = "Not Owner",
            NotPermission = "Not Permission",
        }
        export enum Socket {
            NotConnected = "Not Connected",
            NoConnection = "No Connection",
            NotAllowed = "Not Allowed",
            Timeout = "Timeout Error",
            NotPermission = "Not Permission",
            Disconnected = "Disconnected from server",
        }
    }
}