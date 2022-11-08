"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const placeproductModel_1 = require("../model/placeproductModel");
class PlaceproductRepository {
    static async updateProductplaceState(product, place, isAvailable) {
        return await placeproductModel_1.PlaceproductModel.findOneAndUpdate({ product, place }, { product, place, isAvailable }, { new: true, upsert: true });
    }
}
exports.default = PlaceproductRepository;
