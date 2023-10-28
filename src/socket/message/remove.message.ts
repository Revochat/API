import User from "../../database/models/User"
import Message from "../../database/models/Message"
import Channel from "../../database/models/Channel"
import bcrypt from "bcrypt"
import UTILS from "../../utils"
import Logger from "../../logger"

export default {
    name: "remove.message",
    description: "Remove a message",
    run: async function (socket: any, data: any) {

    }
}