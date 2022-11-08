import { NextFunction, RequestHandler, Response } from "express";
import catchAsync from "../../helper/catchAsync";
import HttpError from "../../helper/HttpError";
import { Types } from "mongoose";
import SuggestRepository from "../../database/repositories/suggestRepository";
import { ProtectedRequest } from "../../types/ProtectedRequest";
import PlaceRepository from "../../database/repositories/placeRepository";
import { SUGGEST_TYPE } from "../../database/model/suggestModel";
import CategoryRepository from "../../database/repositories/categoryRepository";
import ProductRepository from "../../database/repositories/productRepository";

export const suggestEdit: RequestHandler = catchAsync(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { type, data } = req.body;
    console.log(req?.files);
    console.log({ data });
    await SuggestRepository.createSuggest({ type, data: JSON.stringify(data) });
    res.status(200).json({
      payload: {
        type,
        data,
      },
    });
  }
);

export const getSuggestions: RequestHandler = catchAsync(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    console.log("it working");
    const suggestions = await SuggestRepository.findSuggestions(req.query);
    console.log({ suggestions });
    res.status(200).json({
      payload: {
        suggestions,
      },
    });
  }
);

export const deleteSuggestion: RequestHandler = catchAsync(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const suggestion = await SuggestRepository.deleteSuggestion(
      new Types.ObjectId(id)
    );
    console.log(suggestion);
    if (!suggestion)
      return next(
        new HttpError("can not delete suggestion with this id " + id, 404)
      );
    res.status(204).json({});
  }
);
export const acceptSuggestion: RequestHandler = catchAsync(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const suggestion = await SuggestRepository.findSuggestionByObject(
      new Types.ObjectId(id)
    );
    if (!suggestion)
      return next(
        new HttpError("can not find suggestion with this id " + id, 404)
      );
    const { type, data } = suggestion;
    console.log(type);
    const parsedData = JSON.parse(data);
    console.log({ parsedData });
    // delete parsedData.id;

    let result;
    switch (+type) {
      case SUGGEST_TYPE.PLACE:
        result = await PlaceRepository.updatePlaceById(
          new Types.ObjectId(parsedData.id),

          parsedData
        );
        break;
      case SUGGEST_TYPE.CATEGORY:
        result = await CategoryRepository.updateCategoryById(
          parsedData.id,
          parsedData
        );
        break;
      case SUGGEST_TYPE.PRODUCT:
        result = await ProductRepository.updateProductById(
          parsedData.id,
          parsedData
        );
        break;

      default:
        break;
    }
    res.status(200).json({ result, parsedData });
  }
);
