import express from "express"
import DB from "../../../database"
import Logger from "../../../client/logger.client"
import { RouteResponse, Status } from "../../controller"
import Emitter from "../../../client/emitter.client"
import UTILS from "../../../utils"

export const removeBlocked = async (req: express.Request, res: express.Response) => { // Remove a blocked user from the user
    try {
        const { token, blocked_id } = req.params

        // if token or blocked_id badly formatted
        if(!token || !blocked_id || token.length < UTILS.CONSTANTS.USER.TOKEN.MIN_TOKEN_LENGTH || token.length > UTILS.CONSTANTS.USER.TOKEN.MAX_TOKEN_LENGTH ||
            blocked_id.length < UTILS.CONSTANTS.USER.ID.MIN_LENGTH || blocked_id.length > UTILS.CONSTANTS.USER.ID.MAX_LENGTH) throw "Badly formatted"

        var User = await DB.users.find.token(token)
        if(!User) throw "User not found"
        User.blocked.splice(User.blocked.indexOf(blocked_id), 1)
        User.updated_at = new Date().toLocaleString()
        User.save()
        Logger.debug(`User ${User} has been updated`)
        Emitter.emit("removeBlocked", User)
        res.json(
            new RouteResponse()
                .setStatus(Status.success)
                .setMessage(`Blocked removed`)
                .setData(User)
        )
    }
    catch(err) {
        res.json(
            new RouteResponse()
                .setStatus(Status.error)
                .setMessage(err as string)
        )
    }
}