import express from "express";

export default {
    name: "/test",
    description: "test route",
    method: "GET",
    run: async (req: express.Request, res: express.Response) => {
        // Your logic here
        res.send("Test route response");
    }
}