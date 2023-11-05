import express from "express";

export default {
    name: "/ping",
    description: "ping api http",
    method: "GET",
    run: async (req: express.Request, res: express.Response) => {
        // Your logic here
        res.send("Pong !");
    }
}