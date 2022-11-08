"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (options) => {
    // 1) Create a transporter
    const transporter = nodemailer_1.default.createTransport({
        host: "ssl0.ovh.net",
        port: 465,
        auth: {
            user: "no-reply@ostedhy.com",
            pass: "OstedhyEmail123+456+789+",
        },
    });
    // 2) Define the email options
    const mailOptions = {
        from: "no-reply@ostedhy.com",
        to: options.to,
        subject: options.subject,
        text: options.text,
        // html: options.html,
    };
    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
};
exports.default = sendEmail;
