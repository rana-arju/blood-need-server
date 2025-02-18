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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const transporter = nodemailer_1.default.createTransport({
    host: config_1.default.email.host,
    port: config_1.default.email.port,
    auth: {
        user: config_1.default.email.user,
        pass: config_1.default.email.pass,
    },
});
const sendEmail = (to, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: config_1.default.email.from,
        to,
        subject,
        text,
    };
    try {
        yield transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
});
exports.sendEmail = sendEmail;
