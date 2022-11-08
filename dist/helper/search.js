"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSearchFilter = exports.generateCategoryFilter = void 0;
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
function generateSearchFilter(search, isAvailable = null) {
    console.log(isAvailable === null);
    if (!search)
        return [{ deletedAt: null }];
    const searchableFields = [
        { field: "name", type: "string" },
        { field: "category.products", type: "array" },
    ];
    const value = new RegExp(search.trim());
    const searchFilter = searchableFields.map((ele) => {
        if (ele.type === "array") {
            return {
                [ele.field]: {
                    $elemMatch: {
                        name: { $regex: value, $options: "i" },
                        ...(isAvailable !== null && {
                            isAvailable: isAvailable === "true",
                        }),
                    },
                },
            };
        }
        return { [ele.field]: { $regex: value, $options: "i" } };
    });
    return searchFilter;
}
exports.generateSearchFilter = generateSearchFilter;
