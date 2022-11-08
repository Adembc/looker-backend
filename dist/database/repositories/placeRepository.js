"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiFeatures_1 = __importDefault(require("../../helper/ApiFeatures"));
const placeModel_1 = require("../model/placeModel");
const imageModel_1 = require("../model/imageModel");
const categoryModel_1 = require("../model/categoryModel");
const productModel_1 = require("../model/productModel");
const placeproductModel_1 = require("../model/placeproductModel");
const search_1 = require("../../helper/search");
const calculateDistance_1 = __importDefault(require("../../helper/calculateDistance"));
class PlaceRepository {
    static async createPlace(data) {
        return await placeModel_1.PlaceModel.create(data);
    }
    static async findPlaces(queryObject, popOptions = {}, data = {}) {
        const searchableFields = ["name", "lat", "lan"];
        const features = new ApiFeatures_1.default(placeModel_1.PlaceModel.find({ ...data, deletedAt: null }).populate(popOptions), queryObject)
            .filter()
            .search(searchableFields)
            .sort()
            .limitField();
        return await features.mongoseQuery;
    }
    static async updatePlaceById(id, data = {}) {
        return await placeModel_1.PlaceModel.findOneAndUpdate({ _id: id, deletedAt: null }, data, { new: true });
    }
    static async deletePlaceById(id) {
        return await placeModel_1.PlaceModel.findOneAndUpdate({ _id: id, deletedAt: null }, { deletedAt: new Date() });
    }
    static async findPlaceByObject(filter) {
        return await placeModel_1.PlaceModel.findOne({ ...filter, deletedAt: null });
    }
    static async findPlaceForUser(filter) {
        const { lat, lan, category, search, isAvailable } = filter;
        const categories = (0, search_1.generateCategoryFilter)(category);
        const searchFilter = (0, search_1.generateSearchFilter)(search, isAvailable || null);
        const aggregationArray = [
            {
                $match: {
                    deletedAt: null,
                    status: placeModel_1.STATUS.ACCEPTED,
                    ...(categories && { category: { $in: categories } }),
                },
            },
            {
                $lookup: {
                    from: imageModel_1.COLLECTION_NAME,
                    localField: "slides",
                    foreignField: "_id",
                    as: "slides",
                },
            },
            {
                $lookup: {
                    from: categoryModel_1.COLLECTION_NAME,
                    as: "category",
                    let: { categoryId: "$category", placeId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$_id", "$$categoryId"] },
                                        { $lte: ["$deletedAt", null] },
                                    ],
                                },
                            },
                        },
                        {
                            $lookup: {
                                from: productModel_1.COLLECTION_NAME,
                                as: "products",
                                let: { products: "$products", placeId: "$$placeId" },
                                pipeline: [
                                    {
                                        $match: {
                                            deletedAt: null,
                                            $expr: { $in: ["$_id", "$$products"] },
                                        },
                                    },
                                    {
                                        $lookup: {
                                            from: placeproductModel_1.COLLECTION_NAME,
                                            as: "check",
                                            localField: "_id",
                                            foreignField: "product",
                                        },
                                    },
                                    {
                                        $addFields: {
                                            items: {
                                                $filter: {
                                                    input: "$check",
                                                    as: "item",
                                                    cond: { $eq: ["$$item.place", "$$placeId"] },
                                                },
                                            },
                                        },
                                    },
                                    {
                                        $addFields: {
                                            isAvailable: {
                                                $cond: {
                                                    if: { $gt: [{ $size: "$items" }, 0] },
                                                    then: { $first: "$items.isAvailable" },
                                                    else: null,
                                                },
                                            },
                                        },
                                    },
                                    {
                                        $project: {
                                            check: 0,
                                            items: 0,
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
            {
                $unwind: "$category",
            },
            {
                $match: {
                    $or: searchFilter,
                },
            },
        ];
        if (lan && lat) {
            aggregationArray.push({
                $addFields: {
                    distance: (0, calculateDistance_1.default)(lat, lan),
                },
            });
            aggregationArray.push({ $sort: { distance: 1 } });
        }
        return await placeModel_1.PlaceModel.aggregate(aggregationArray);
    }
}
exports.default = PlaceRepository;
