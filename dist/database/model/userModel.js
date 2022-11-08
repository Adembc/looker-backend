"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_paginate_ts_1 = require("mongoose-paginate-ts");
exports.DOCUMENT_NAME = "User";
exports.COLLECTION_NAME = "users";
const Schema = mongoose_1.default.Schema;
const schema = new Schema({
    firstName: { type: String, trim: true, min: 3 },
    lastName: { type: String, trim: true, min: 3 },
    phone: { type: String },
    email: { type: String },
    password: { type: String, select: false },
    avatar: {
        type: String,
    },
    passwordChangedAt: Date,
    deletedAt: { type: Date, select: false },
}, { timestamps: true, versionKey: false });
// hashing password before store it to database
schema.pre("save", async function (next) {
    // crypt password
    if (!this.isModified("password"))
        return next();
    this.password = await bcryptjs_1.default.hash(this.password, 12);
});
// save password changed at
schema.pre("save", function (next) {
    if (!this.isModified("password") ||
        this.isNew ||
        !this.password ||
        !this.passwordChangedAt)
        return next();
    this.passwordChangedAt = new Date(Date.now() - 1000);
    next();
});
// check if password correct
schema.methods.isCorrectPassword = async function (psw1, psw2) {
    return await bcryptjs_1.default.compare(psw1, psw2);
};
schema.methods.generateToken = function (id, secert, expire) {
    return jsonwebtoken_1.default.sign(id, secert, {
        expiresIn: expire,
    });
};
schema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const jwtMillSec = JWTTimestamp * 1000;
        const pswChangeMillSec = this.passwordChangedAt.getTime();
        return jwtMillSec < pswChangeMillSec;
    }
    //false means does not change
    return false;
};
schema.pre(/^find/, function (next) {
    this.find({ deletedAt: null });
    next();
});
schema.plugin(mongoose_paginate_ts_1.mongoosePagination);
exports.User = mongoose_1.default.model(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
