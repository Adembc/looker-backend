"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = void 0;
const promises_1 = require("node:fs/promises");
const deleteFile = async (docId, findDocById, fieldname, filePath) => {
    let doc;
    if (!filePath) {
        doc = await findDocById(docId);
    }
    const src = `${filePath
        ? filePath?.slice(process.env.SERVER_URL.length)
        : doc[fieldname]?.slice(process.env.SERVER_URL.length)}`;
    if (!src || src == "undefined")
        return;
    const path = "public/" + src;
    try {
        await (0, promises_1.unlink)(path);
    }
    catch (err) {
        console.log(err);
    }
};
exports.deleteFile = deleteFile;
