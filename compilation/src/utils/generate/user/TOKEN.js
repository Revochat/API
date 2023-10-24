"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserToken = void 0;
const uuid_1 = require("uuid");
function generateUserToken() {
    return ((0, uuid_1.v5)(Date.now().toString(), (0, uuid_1.v4)()).split("-").join("") + Date.now()).toUpperCase();
}
exports.generateUserToken = generateUserToken;
