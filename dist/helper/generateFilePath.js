"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const filePath_1 = __importDefault(require("./filePath"));
function generateFilePath(item, files, isMultiple = false, index) {
    const itemCopy = JSON.parse(JSON.stringify(item));
    files?.forEach((fl) => {
        const lengthOfKeyName = "questionBlocks".length + 1; // +1 for [;
        const questionBlockIndex = +fl.fieldname[lengthOfKeyName];
        let props = fl.fieldname.split("]").join("").split("[");
        if (isMultiple)
            props = props.slice(2);
        if (!isMultiple || index == questionBlockIndex) {
            if (props.length === 1) {
                itemCopy[props[0]] = (0, filePath_1.default)(fl.path);
            }
            if (props.length === 2)
                itemCopy[props[0]][props[1]] = (0, filePath_1.default)(fl.path);
            if (props.length === 3) {
                itemCopy[props[0]][props[1]][props[2]] = (0, filePath_1.default)(fl.path);
                // console.log("here");
            }
            if (props.length === 4)
                itemCopy[props[0]][props[1]][props[2]][props[3]] = (0, filePath_1.default)(fl.path);
        }
    });
    return itemCopy;
}
exports.default = generateFilePath;
