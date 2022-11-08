"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function filePath(path) {
    if (!path)
        return undefined;
    return process.env.SERVER_URL + path.slice("public/".length);
}
exports.default = filePath;
