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
const User_1 = __importDefault(require("../../../database/models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.default = {
    name: "/user/auth/login",
    description: "Login a user",
    method: "POST",
    run: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { username, password } = req.body;
            // if username or password badly formatted
            if (!username || !password)
                throw "Badly formatted";
            var user = yield User_1.default.findOne({ username: username });
            if (!user)
                throw "User not found";
            // if password is invalid
            if (!bcrypt_1.default.compareSync(password, user.password))
                throw "Invalid password";
            res.status(200);
            res.send({ user: user });
        }
        catch (err) {
            res.status(400);
            res.send("An error occured");
        }
    })
};
