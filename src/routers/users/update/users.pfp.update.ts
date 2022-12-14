import express from "express"
import DB from "../../../database"
import Logger from "../../../client/logger.client"
import { RouteResponse, Status } from "../../controller"
import Emitter from "../../../client/emitter.client"
import UTILS from "../../../utils"

export const pfpUpdate = async (req: express.Request, res: express.Response) => { // Update the profile picture
    try {
        const { token, newprofile_picture } = req.params

        // PROFILE PICTURE HANDLE

        // if token or newprofile_picture badly formatted
        if(!token || !newprofile_picture || token.length < UTILS.CONSTANTS.USER.TOKEN.MIN_TOKEN_LENGTH || token.length > UTILS.CONSTANTS.USER.TOKEN.MAX_TOKEN_LENGTH ||
            newprofile_picture.length >= UTILS.CONSTANTS.USER.PROFILE_PICTURE.MAX_SIZE) throw "Badly formatted"

        var User = await DB.users.find.token(token)
        if(!User) throw "User not found"
        User.profile_picture = newprofile_picture
        User.updated_at = new Date().toLocaleString()
        User.save()
        Logger.debug(`User ${User} has been updated`)
        Emitter.emit("updateProfilePicture", User)
        res.json(
            new RouteResponse()
                .setStatus(Status.success)
                .setMessage(`Profile picture updated`)
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