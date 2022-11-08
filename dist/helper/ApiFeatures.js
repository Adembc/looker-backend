"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class APIFeatures {
    constructor(mongoseQuery, queryObject) {
        this.mongoseQuery = mongoseQuery;
        this.queryObject = queryObject;
    }
    filter() {
        const queryObj = { ...this.queryObject };
        const excludedFields = ["limit", "sort", "page", "fields", "search"];
        excludedFields.forEach((ele) => delete queryObj[ele]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|ne)\b/g, (match) => `$${match}`);
        const filterObject = JSON.parse(queryStr);
        if (filterObject && filterObject?.questionType) {
            if (filterObject.questionType?.["$ne"] == "null")
                filterObject.questionType["$ne"] = null;
            if (filterObject.questionType == "null")
                filterObject.questionType = null;
        }
        this.mongoseQuery.find(filterObject);
        return this;
    }
    sort() {
        if (this.queryObject.sort) {
            const sortBy = this.queryObject.sort.split(",").join(" ");
            this.mongoseQuery = this.mongoseQuery.sort(sortBy);
        }
        else {
            this.mongoseQuery = this.mongoseQuery.sort("-createdAt");
        }
        return this;
    }
    limitField() {
        if (this.queryObject.fields) {
            const fields = `${this.queryObject.fields.split(",").join(" ")}`;
            this.mongoseQuery = this.mongoseQuery.select(fields);
        }
        return this;
    }
    search(searchableFields) {
        if (this.queryObject.search) {
            const value = new RegExp(this.queryObject.search.trim());
            const filter = searchableFields.map((field) => {
                return { [field]: { $regex: value, $options: "i" } };
            });
            this.mongoseQuery.find({ $or: filter });
        }
        return this;
    }
}
exports.default = APIFeatures;
