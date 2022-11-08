"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlace = exports.updatePlace = exports.createPlace = exports.getPlaces = exports.getUserPlaces = void 0;
const catchAsync_1 = __importDefault(require("../../helper/catchAsync"));
const HttpError_1 = __importDefault(require("../../helper/HttpError"));
const mongoose_1 = require("mongoose");
const placeRepository_1 = __importDefault(require("../../database/repositories/placeRepository"));
const placeModel_1 = require("../../database/model/placeModel");
const categoryRepository_1 = __importDefault(require("../../database/repositories/categoryRepository"));
const imageModel_1 = require("../../database/model/imageModel");
exports.getUserPlaces = (0, catchAsync_1.default)(async (req, res, next) => {
    const data = await placeRepository_1.default.findPlaceForUser(req.query);
    res.status(200).json({
        results: data.length,
        payload: {
            places: data,
        },
    });
});
exports.getPlaces = (0, catchAsync_1.default)(async (req, res, next) => {
    const data = await placeRepository_1.default.findPlaces(req.query, {
        path: "category",
    });
    res.status(200).json({
        results: data.length,
        payload: {
            places: data,
        },
    });
});
exports.createPlace = (0, catchAsync_1.default)(async (req, res, next) => {
    const { name, category, lat, lan } = req.body;
    const isCategoryExist = await categoryRepository_1.default.findCategoryByObject({
        _id: category,
    });
    if (!isCategoryExist) {
        return next(new HttpError_1.default("category not found with this id " + category, 404));
    }
    const isExist = await placeRepository_1.default.findPlaceByObject({
        lat,
        lan,
        status: placeModel_1.STATUS.ACCEPTED,
    });
    if (isExist)
        return next(new HttpError_1.default("this place is already exist", 400));
    const slides = [];
    for (let i = 0; i < req?.files?.length; i++) {
        const fl = req.files[i];
        const image = await imageModel_1.ImageModel.create({ url: fl.path });
        slides.push(image._id);
    }
    console.log({ slides });
    const doc = await placeRepository_1.default.createPlace({
        ...req.body,
        slides,
        ...(req.originalUrl.includes("admin") && { status: placeModel_1.STATUS.ACCEPTED }),
        name: name.toLowerCase(),
        [req?.file?.fieldname]: req?.file?.path,
    });
    const place = {
        _id: doc._id,
        name: doc.name,
        lat: doc.lat,
        lan: doc.lan,
        slides: doc.slides,
        category: doc.category,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
    res.status(201).json({
        payload: {
            place,
        },
    });
});
exports.updatePlace = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    if (name) {
        const isExist = await placeRepository_1.default.findPlaceByObject({
            name,
        });
        if (isExist)
            return next(new HttpError_1.default("try another name", 400));
    }
    const doc = await placeRepository_1.default.updatePlaceById(new mongoose_1.Types.ObjectId(id), {
        ...req.body,
        [req?.file?.fieldname]: req?.file?.path,
    });
    if (!doc)
        return next(new HttpError_1.default("can not update place with id : " + id, 400));
    const place = {
        _id: doc?._id,
        name: doc?.name,
        lat: doc?.lat,
        lan: doc?.lan,
        category: doc?.category,
        createdAt: doc?.createdAt,
        updatedAt: doc?.updatedAt,
    };
    return res.status(200).json({
        payload: {
            place,
        },
    });
});
exports.deletePlace = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const doc = await placeRepository_1.default.deletePlaceById(new mongoose_1.Types.ObjectId(id));
    if (!doc)
        return next(new HttpError_1.default(`can't delete place with this ID : ${id}`, 404));
    res.status(204).json({});
});
