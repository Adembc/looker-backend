import { NextFunction, RequestHandler, Response, Request } from "express";
import catchAsync from "../../helper/catchAsync";
import HttpError from "../../helper/HttpError";
import { Types } from "mongoose";
import PlaceRepository from "../../database/repositories/placeRepository";
import IPlace, { STATUS } from "../../database/model/placeModel";
import CategoryRepository from "../../database/repositories/categoryRepository";
import { ImageModel } from "../../database/model/imageModel";

export const getPlaces: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await PlaceRepository.findPlaces(req.query, {
      path: "category",
    });
    res.status(200).json({
      results: data.length,
      payload: {
        places: data,
      },
    });
  }
);

export const createPlace: RequestHandler = catchAsync(
  async (req, res: Response, next: NextFunction) => {
    const { name, category, lat, lan } = req.body;
    const isCategoryExist = await CategoryRepository.findCategoryByObject({
      _id: category,
    });
    if (!isCategoryExist) {
      return next(
        new HttpError("category not found with this id " + category, 404)
      );
    }
    const isExist = await PlaceRepository.findPlaceByObject({
      lat,
      lan,
      status: STATUS.ACCEPTED,
    });
    if (isExist) return next(new HttpError("this place is already exist", 400));
    const slides: string[] = [];
    for (let i = 0; i < req?.files?.length; i++) {
      const fl = req.files[i];
      const image = await ImageModel.create({ url: fl.path });
      slides.push(image._id);
    }
    console.log({ slides });
    const doc = await PlaceRepository.createPlace({
      ...req.body,
      slides,
      ...(req.originalUrl.includes("admin") && { status: STATUS.ACCEPTED }),
      name: name.toLowerCase(),
      [req?.file?.fieldname]: req?.file?.path,
    } as IPlace);
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
  }
);

export const updatePlace: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name } = req.body;

    if (name) {
      const isExist = await PlaceRepository.findPlaceByObject({
        name,
      });
      if (isExist) return next(new HttpError("try another name", 400));
    }

    const doc = await PlaceRepository.updatePlaceById(new Types.ObjectId(id), {
      ...req.body,
      [req?.file?.fieldname]: req?.file?.path,
    });
    if (!doc)
      return next(new HttpError("can not update place with id : " + id, 400));
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
  }
);

export const deletePlace: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const doc = await PlaceRepository.deletePlaceById(new Types.ObjectId(id));
    if (!doc)
      return next(
        new HttpError(`can't delete place with this ID : ${id}`, 404)
      );
    res.status(204).json({});
  }
);

export const onlyAccepted: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.query.status = STATUS.ACCEPTED.toString();
  next();
};
