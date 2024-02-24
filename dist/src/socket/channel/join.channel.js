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
const logger_1 = __importDefault(require("../../logger"));
const Channel_1 = __importDefault(require("../../database/models/Channel"));
const utils_1 = __importDefault(require("../../utils"));
exports.default = {
    name: utils_1.default.EVENTS.Channel.Join,
    description: "join a channel",
    run: function (socket, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!socket.revo.logged)
                    return socket.emit(utils_1.default.EVENTS.Channel.Join, { error: "You are not logged in" });
                if (!data.channel_id)
                    return socket.emit(utils_1.default.EVENTS.Channel.Join, { error: "Missing parameters" });
                // check if channel exists
                const channel = yield Channel_1.default.findOne({ channel_id: data.channel_id });
                if (!channel)
                    return socket.emit(utils_1.default.EVENTS.Channel.Join, { error: "Channel not found" });
                socket.join(data.channel_id);
            }
            catch (error) {
                logger_1.default.error(error);
                socket.emit(utils_1.default.EVENTS.Channel.Join, { error: "An error occured" });
            }
        });
    }
};
