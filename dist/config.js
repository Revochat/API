"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const BASE_URI = process.env.BASE_URI;
const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_PORT = process.env.MONGO_PORT;
exports.config = {
    application: {
        name: "RevochatAPI",
        version: "1.2.0",
        description: `Revochat is a chat application that allows you to chat with your friends securely and privately.
        `,
        owners: [
            "ByLife",
            "Thomas78125",
            "Lux",
        ],
    },
    properties: {
        port: Number(process.env.APP_PORT) || 3000,
        readyEventTimeout: 500,
    },
    mongo: {
        username: MONGO_USERNAME,
        url: (((_a = process.env.MONGO_URL) === null || _a === void 0 ? void 0 : _a.replace("<USERNAME>", MONGO_USERNAME).replace("<PASSWORD>", MONGO_PASSWORD).replace("<HOST>", MONGO_HOST).replace("<PORT>", MONGO_PORT)) || "mongodb://localhost:27017/Revochat"),
    },
    api: {
        url: BASE_URI,
        version: "0.6.9",
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
};
