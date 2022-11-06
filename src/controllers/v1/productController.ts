import { NextFunction, RequestHandler, Response } from "express";
import catchAsync from "../../helper/catchAsync";
import HttpError from "../../helper/HttpError";
import { Types } from "mongoose";
import ProductRepository from "../../database/repositories/productRepository";
import IProduct from "../../database/model/productModel";
import PlaceRepository from "../../database/repositories/placeRepository";
import PlaceproductRepository from "../../database/repositories/placeProductRepository";
import { ProtectedRequest } from "../../types/ProtectedRequest";

export const getProducts: RequestHandler = catchAsync(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const data = await ProductRepository.findProducts(req.query);
    res.status(200).json({
      results: data.length,
      payload: {
        products: data,
      },
    });
  }
);

export const createProduct: RequestHandler = catchAsync(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { name } = req.body;

    const isExist = await ProductRepository.findProductByObject({
      name: name.toLowerCase(),
    });
    if (isExist)
      return next(new HttpError("this product is already exist", 400));

    const doc = await ProductRepository.createProduct({
      name: name.toLowerCase(),
      [req?.file?.fieldname]: req?.file?.path,
    } as IProduct);
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
  }
);

export const updateProduct: RequestHandler = catchAsync(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name } = req.body;

    if (name) {
      const isExist = await ProductRepository.findProductByObject({
        name,
      });
      if (isExist) return next(new HttpError("try another name", 400));
    }

    const doc = await ProductRepository.updateProductById(
      new Types.ObjectId(id),
      {
        ...req.body,
        [req?.file?.fieldname]: req?.file?.path,
      }
    );
    if (!doc)
      return next(new HttpError("can not update product with id : " + id, 400));
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
  }
);

export const deleteProduct: RequestHandler = catchAsync(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const doc = await ProductRepository.deleteProductById(
      new Types.ObjectId(id)
    );
    if (!doc)
      return next(
        new HttpError(`can't delete product with this ID : ${id}`, 404)
      );
    res.status(204).json({});
  }
);
export const updateProductState: RequestHandler = catchAsync(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { product, place, isAvailable } = req.body;
    const [isProductExist, isPlaceExist] = await Promise.all([
      ProductRepository.findProductByObject({ _id: product }),
      PlaceRepository.findPlaceByObject({ _id: place }),
    ]);
    if (!isProductExist)
      return next(
        new HttpError(`product not found with this id ${product}`, 404)
      );
    if (!isPlaceExist)
      return next(new HttpError(`place not found with this id ${place}`, 404));
    await PlaceproductRepository.updateProductplaceState(
      product,
      place,
      isAvailable
    );
    res.status(200).json({
      product,
      place,
      isAvailable,
    });
  }
);
