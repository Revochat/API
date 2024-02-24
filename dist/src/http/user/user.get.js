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
exports.default = {
    name: "/user/get",
    description: "Get a user",
    method: "GET",
    run: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { user_id } = req.params;
            // Get the token from the request header
            const token = req.headers["authorization"];
            // if token or user_id badly formatted
            if (!token || !user_id)
                throw "Badly formatted";
            var user = yield User_1.default.findOne({ id: parseInt(user_id) });
            if (user) { // if user token is valid
                if (user.id == parseInt(user_id)) {
                    res.status(200);
                    res.send(user);
                }
            }
            throw "User not found";
        }
        catch (err) {
            res.status(400);
            res.send("Test route response");
        }
    })
};
