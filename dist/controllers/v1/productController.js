"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductState = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProducts = void 0;
const catchAsync_1 = __importDefault(require("../../helper/catchAsync"));
const HttpError_1 = __importDefault(require("../../helper/HttpError"));
const mongoose_1 = require("mongoose");
const productRepository_1 = __importDefault(require("../../database/repositories/productRepository"));
const placeRepository_1 = __importDefault(require("../../database/repositories/placeRepository"));
const placeProductRepository_1 = __importDefault(require("../../database/repositories/placeProductRepository"));
exports.getProducts = (0, catchAsync_1.default)(async (req, res, next) => {
    const data = await productRepository_1.default.findProducts(req.query);
    res.status(200).json({
        results: data.length,
        payload: {
            products: data,
        },
    });
});
exports.createProduct = (0, catchAsync_1.default)(async (req, res, next) => {
    const { name } = req.body;
    const isExist = await productRepository_1.default.findProductByObject({
        name: name.toLowerCase(),
    });
    if (isExist)
        return next(new HttpError_1.default("this product is already exist", 400));
    const doc = await productRepository_1.default.createProduct({
        name: name.toLowerCase(),
        [req?.file?.fieldname]: req?.file?.path,
    });
    const product = {
        _id: doc._id,
        name: doc.name,
        img: doc?.img,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
    res.status(201).json({
        payload: {
            product,
        },
    });
});
exports.updateProduct = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    if (name) {
        const isExist = await productRepository_1.default.findProductByObject({
            name,
        });
        if (isExist)
            return next(new HttpError_1.default("try another name", 400));
    }
    const doc = await productRepository_1.default.updateProductById(new mongoose_1.Types.ObjectId(id), {
        ...req.body,
        [req?.file?.fieldname]: req?.file?.path,
    });
    if (!doc)
        return next(new HttpError_1.default("can not update product with id : " + id, 400));
    const product = {
        _id: doc?._id,
        name: doc?.name,
        img: doc?.img,
        createdAt: doc?.createdAt,
        updatedAt: doc?.updatedAt,
    };
    return res.status(200).json({
        payload: {
            product,
        },
    });
});
exports.deleteProduct = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const doc = await productRepository_1.default.deleteProductById(new mongoose_1.Types.ObjectId(id));
    if (!doc)
        return next(new HttpError_1.default(`can't delete product with this ID : ${id}`, 404));
    res.status(204).json({});
});
exports.updateProductState = (0, catchAsync_1.default)(async (req, res, next) => {
    const { product, place, isAvailable } = req.body;
    const [isProductExist, isPlaceExist] = await Promise.all([
        productRepository_1.default.findProductByObject({ _id: product }),
        placeRepository_1.default.findPlaceByObject({ _id: place }),
    ]);
    if (!isProductExist)
        return next(new HttpError_1.default(`product not found with this id ${product}`, 404));
    if (!isPlaceExist)
        return next(new HttpError_1.default(`place not found with this id ${place}`, 404));
    await placeProductRepository_1.default.updateProductplaceState(product, place, isAvailable);
    res.status(200).json({
        product,
        place,
        isAvailable,
    });
});
