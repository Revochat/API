import dotenv from "dotenv";
dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_PORT = process.env.MONGO_PORT;

export const config = { // This is the config file for the RevoAPI. You can change the port, the timeout, and the application name, version, description, and owners.
    application: {
        name: "RevochatAPI",
        version: "1.2.0",
        description: `Revochat is a chat application that allows you to chat with your friends securely and privately.
        `,
        owners : [
            "ByLife",
            "Thomas78125",
            "Lux",
        ],
    }, 

    properties : {
        port: Number(process.env.API_PORT) || 3000,
        readyEventTimeout: 500,
    },
    mongo: {
        username: MONGO_USERNAME,
        url: (process.env.MONGO_URL?.replace("<USERNAME>", MONGO_USERNAME!).replace("<PASSWORD>", MONGO_PASSWORD!).replace("<HOST>", MONGO_HOST!).replace("<PORT>", MONGO_PORT!) || "mongodb://localhost:27017/Revochat"),
    },
    api : {
        version : "1",
    },
    ascii: {
        art: `
        _______                                           __                    __     
        /       \                                         /  |                  /  |    
        $$$$$$$  |  ______   __     __  ______    _______ $$ |____    ______   _$$ |_   
        $$ |__$$ | /      \ /  \   /  |/      \  /       |$$      \  /      \ / $$   |  
        $$    $$< /$$$$$$  |$$  \ /$$//$$$$$$  |/$$$$$$$/ $$$$$$$  | $$$$$$  |$$$$$$/   
        $$$$$$$  |$$    $$ | $$  /$$/ $$ |  $$ |$$ |      $$ |  $$ | /    $$ |  $$ | __ 
        $$ |  $$ |$$$$$$$$/   $$ $$/  $$ \__$$ |$$ \_____ $$ |  $$ |/$$$$$$$ |  $$ |/  |
        $$ |  $$ |$$       |   $$$/   $$    $$/ $$       |$$ |  $$ |$$    $$ |  $$  $$/ 
        $$/   $$/  $$$$$$$/     $/     $$$$$$/   $$$$$$$/ $$/   $$/  $$$$$$$/    $$$$/                                                                                
        `
    }
}