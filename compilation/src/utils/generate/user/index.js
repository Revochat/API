"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ID_1 = require("./ID");
const TOKEN_1 = require("./TOKEN");
exports.default = {
    ID: (0, ID_1.generateUserId)(),
    TOKEN: (0, TOKEN_1.generateUserToken)()
};
