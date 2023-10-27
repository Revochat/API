import express from "express";
import User from "../../database/models/User"

export default {
    name: "/user/get",
    description: "Get a user",
    method: "GET",
    run: async (req: express.Request, res: express.Response) => {
        try {
            const {user_id} = req.params
            // Get the token from the request header
            const token = req.headers["authorization"];

            // if token or user_id badly formatted
            if(!token || !user_id) throw "Badly formatted"

            var user = await User.findOne({id: parseInt(user_id)})
            if(user) { // if user token is valid
                if(user.id == parseInt(user_id)) {
                    res.status(200)
                    res.send(user)
                }
            }
            throw "User not found"
        }

        catch(err) {
            res.status(400)
            res.send("Test route response");
        }
    }
}