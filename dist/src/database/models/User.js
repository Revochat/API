"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const RevoUserSchema = new mongoose_1.Schema({
    user_id: { type: Number, required: true },
    identifier: { type: String, required: true },
    token: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    premium_expiration: { type: Date, required: false, default: null },
    avatar: { type: String, required: false, default: "default" },
    message_privacy: { type: String, required: true, default: "everyone" },
    status: { type: String, required: true, default: "offline" },
    updated_at: { type: Date, required: true, default: new Date() },
    created_at: { type: Date, required: true, default: new Date() },
    last_connection: { type: Date, required: true, default: new Date() },
    servers: { type: Array, required: true, default: [] },
    channels: { type: Array, required: true, default: [] },
    friends: { type: Array, required: true, default: [] },
    friends_requests_received: { type: Array, required: true, default: [] },
    friends_requests_sent: { type: Array, required: true, default: [] },
    blocked: { type: Array, required: true, default: [] },
});
exports.default = mongoose_1.default.model("RevoUser", RevoUserSchema);
