import { NextFunction, RequestHandler, Response, Request } from "express";
import catchAsync from "../../helper/catchAsync";
import HttpError from "../../helper/HttpError";
import { Types } from "mongoose";
import ReviewRepository from "../../database/repositories/reviewRepository";

export const getReviews: RequestHandler = catchAsync(
  async (req, res: Response, next: NextFunction) => {
    const { place } = req.params;
    const { _id: user } = req.user;
    const data = await ReviewRepository.getReviews(place, user);
    res.status(200).json({
      results: data.length,
      payload: {
        products: data,
      },
    });
  }
);

export const reviewPlace: RequestHandler = catchAsync(
  async (req, res: Response, next: NextFunction) => {
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
  async (req, res: Response, next: NextFunction) => {
    const { place } = req.params;
    const { _id: user } = req.user;

    const doc = await ReviewRepository.updateReview(place, user, req.body);
    if (!doc) return next(new HttpError("you should create review first", 400));
    return res.status(200).json({
      payload: {
        doc,
      },
    });
  }
);

export const deleteReview: RequestHandler = catchAsync(
  async (req, res: Response, next: NextFunction) => {
    const { place } = req.params;
    const { _id: user } = req.user;
    const doc = await ReviewRepository.deletedReview(place, user);
    if (!doc) return next(new HttpError(`can't delete this review`, 404));
    res.status(204).json({});
  }
);
