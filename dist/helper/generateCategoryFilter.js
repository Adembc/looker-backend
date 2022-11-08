"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCategoryFilter = void 0;
const mongoose_1 = require("mongoose");
function generateCategoryFilter(category) {
    if (!category)
        return undefined;
    const result = category
        .split(",")
        .filter((ele) => mongoose_1.Types.ObjectId.isValid(ele))
        .map((ele) => new mongoose_1.Types.ObjectId(ele));
    return result.length > 0 ? result : undefined;
}
exports.generateCategoryFilter = generateCategoryFilter;
