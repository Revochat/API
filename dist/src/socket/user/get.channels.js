"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../database/models/User"));
const logger_1 = __importDefault(require("../../logger"));
const utils_1 = __importDefault(require("../../utils"));
exports.default = {
    name: utils_1.default.EVENTS.User.GetChannelList,
    description: "Get the user's channels",
    run: function (socket, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!socket.revo.logged)
                    return socket.emit(utils_1.default.EVENTS.User.Get, { error: "You are not logged in" });
                logger_1.default.info(`[Socket] ${socket.revo.user.username} is trying to user.get ect to the server...`);
                const user = yield User_1.default.findOne({ token: socket.revo.user.token }); // find the user
                if (!user)
                    return socket.emit(utils_1.default.EVENTS.User.Get, { error: "Invalid token" });
                // get the user's channels with aggregate
                const channels = yield User_1.default.aggregate([
                    { $match: { token: socket.revo.user.token } },
                    { $unwind: "$channels" },
                    { $lookup: { from: "channels", localField: "channels", foreignField: "_id", as: "channels" } },
                    { $unwind: "$channels" },
                    { $project: { _id: 0, channels: 1 } }
                ]);
                user.channels = channels.map((channel) => channel.channels); // set the user's channels
                socket.emit(utils_1.default.EVENTS.User.GetChannelList, user); // send a success message to the user
            }
            catch (error) {
                logger_1.default.error(error);
                socket.emit(utils_1.default.EVENTS.User.GetChannelList, { error: "An error occured" });
            }
        });
    }
};
