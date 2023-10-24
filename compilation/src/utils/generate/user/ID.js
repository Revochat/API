"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserId = void 0;
function generateUserId() {
    return Date.now() + Math.floor(Math.random() * 100000);
}
exports.generateUserId = generateUserId;
