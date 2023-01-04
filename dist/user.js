"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
class user {
    constructor(name, handler) {
        this.name = name;
        this.auth = { pw: "1234", twofa: undefined };
        this.handler = handler;
    }
    log() {
        console.log(this.name + " password:" + this.auth.pw);
    }
}
exports.user = user;
