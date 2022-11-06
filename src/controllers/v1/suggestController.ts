import { NextFunction, RequestHandler, Response } from "express";
import catchAsync from "../../helper/catchAsync";
import HttpError from "../../helper/HttpError";
import { Types } from "mongoose";
import SuggestRepository from "../../database/repositories/suggestRepository";
import { ProtectedRequest } from "../../types/ProtectedRequest";

export const suggestEdit: RequestHandler = catchAsync(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { type, data } = req.body;
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
    const suggestions = await SuggestRepository.findSuggestions(req.query);
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
    res.status(200).json({ id });
  }
);
