"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio_1 = __importDefault(require("twilio"));
const client = (0, twilio_1.default)(accountSid, authToken);
const sendSms = (phone, codeVerif) => {
    const to = "+" + phone.slice(2);
    console.log(to);
    client.messages
        .create({
        body: `verifcation code (${codeVerif}) only available for 10 minutes`,
        from: "+16065955411",
        to: "+21655529601",
    })
        .then((message) => console.log(message));
};
exports.default = sendSms;
