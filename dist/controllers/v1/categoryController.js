"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
const catchAsync_1 = __importDefault(require("../../helper/catchAsync"));
const HttpError_1 = __importDefault(require("../../helper/HttpError"));
const mongoose_1 = require("mongoose");
const categoryRepository_1 = __importDefault(require("../../database/repositories/categoryRepository"));
const productRepository_1 = __importDefault(require("../../database/repositories/productRepository"));
exports.getCategories = (0, catchAsync_1.default)(async (req, res, next) => {
    const data = await categoryRepository_1.default.findCategories(req.query);
    res.status(200).json({
        results: data.length,
        payload: {
            categories: data,
        },
    });
});
exports.createCategory = (0, catchAsync_1.default)(async (req, res, next) => {
    const { name, products } = req.body;
    const isExist = await categoryRepository_1.default.findCategoryByObject({
        name: name.toLowerCase(),
    });
    if (isExist)
        return next(new HttpError_1.default("this category is already exist", 400));
    const invalidProducts = [];
    const validProducts = [];
    for (let i = 0; i < products.length; i++) {
        const product = await productRepository_1.default.findProductByObject({
            _id: products[i],
        });
        if (!product)
            invalidProducts.push(products[i]);
        else
            validProducts.push(product._id);
    }
    if (validProducts.length == 0)
        return next(new HttpError_1.default("invalid products", 404));
    const doc = await categoryRepository_1.default.createCategory({
        name: name.toLowerCase(),
        products: validProducts,
        [req?.file?.fieldname]: req?.file?.path,
    });
    const category = {
        _id: doc._id,
        name: doc.name,
        img: doc?.img,
        products: doc?.products,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
    res.status(201).json({
        payload: {
            category,
        },
    });
});
exports.updateCategory = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const { name, products } = req.body;
    if (name) {
        const isExist = await categoryRepository_1.default.findCategoryByObject({
            name,
        });
        if (isExist)
            return next(new HttpError_1.default("try another name", 400));
    }
    const invalidProducts = [];
    const validProducts = [];
    for (let i = 0; i < products?.length; i++) {
        const product = await productRepository_1.default.findProductByObject({
            _id: products[i],
        });
        if (!product)
            invalidProducts.push(products[i]);
        else
            validProducts.push(product._id);
    }
    const doc = await categoryRepository_1.default.updateCategoryById(new mongoose_1.Types.ObjectId(id), {
        ...req.body,
        ...(validProducts.length > 0 && { products: validProducts }),
        [req?.file?.fieldname]: req?.file?.path,
    });
    if (!doc)
        return next(new HttpError_1.default("can not update category with id : " + id, 400));
    const category = {
        _id: doc?._id,
        name: doc?.name,
        img: doc?.img,
        products: doc?.products,
        createdAt: doc?.createdAt,
        updatedAt: doc?.updatedAt,
    };
    return res.status(200).json({
        payload: {
            category,
        },
    });
});
exports.deleteCategory = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const doc = await categoryRepository_1.default.deleteCategoryById(new mongoose_1.Types.ObjectId(id));
    if (!doc)
        return next(new HttpError_1.default(`can't delete category with this ID : ${id}`, 404));
    res.status(204).json({});
});
