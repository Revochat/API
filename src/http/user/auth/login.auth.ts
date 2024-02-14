import express from "express";
import User from "../../../database/models/User"
import bcrypt from "bcrypt"

export default {
    name: "/user/auth/login",
    description: "Login a user",
    method: "POST",
    run: async (req: express.Request, res: express.Response) => {
        try {
            const {username, password} = req.body

            // if username or password badly formatted
            if(!username || !password) throw "Badly formatted"

            var user = await User.findOne({username: username})
            if(!user) throw "User not found"

            // if password is invalid
            if(!bcrypt.compareSync(password, user.password)) throw "Invalid password"

            res.status(200)
            res.send({user: user})
        }

        catch(err) {
            res.status(400)
            res.send("An error occured")
        }
    }
}