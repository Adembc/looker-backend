import { NextFunction, RequestHandler, Response } from "express";
import catchAsync from "../../helper/catchAsync";
import HttpError from "../../helper/HttpError";
import { Types } from "mongoose";
import ReviewRepository from "../../database/repositories/reviewRepository";
import { ProtectedRequest } from "../../types/ProtectedRequest";

export const getReviews: RequestHandler = catchAsync(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { place } = req.params;
    const { _id: user } = req.user;
    const data = await ReviewRepository.getReviews(
      new Types.ObjectId(place),
      user
    );
    res.status(200).json({
      payload: {
        data,
      },
    });
  }
);

export const reviewPlace: RequestHandler = catchAsync(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { place } = req.params;
    const { _id: user } = req.user;
    const { comment, amount } = req.body;
    const isExist = await ReviewRepository.findReviewByObject({ place, user });
    if (isExist)
      return next(new HttpError("you've already reviewed this place ", 400));
    const review = await ReviewRepository.addReview({
      place,
      user,
      comment,
      amount,
    });
    res.status(201).json({
      payload: {
        review,
      },
    });
  }
);

export const updateReview: RequestHandler = catchAsync(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { place } = req.params;
    const { _id: user } = req.user;

    const doc = await ReviewRepository.updateReview(
      new Types.ObjectId(place),
      user,
      req.body
    );
    if (!doc) return next(new HttpError("you should create review first", 400));
    return res.status(200).json({
      payload: {
        doc,
      },
    });
  }
);

export const deleteReview: RequestHandler = catchAsync(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { place } = req.params;
    const { _id: user } = req.user;
    const doc = await ReviewRepository.deletedReview(
      new Types.ObjectId(place),
      user
    );
    if (!doc) return next(new HttpError(`can't delete this review`, 404));
    res.status(204).json({});
  }
);
