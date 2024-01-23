import User from "../../database/models/User";
import Logger from "../../logger";
import Channel from "../../database/models/Channel";
import UTILS from "../../utils";
import Server from "../../database/models/Server";
import Role from "../../database/models/Role";

export default {
    name: "channel.delete",
    decsription: "delete a channel",
};