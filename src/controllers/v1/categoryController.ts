import { NextFunction, RequestHandler, Response, Request } from "express";
import catchAsync from "../../helper/catchAsync";
import HttpError from "../../helper/HttpError";
import { Types } from "mongoose";
import CategoryRepository from "../../database/repositories/categoryRepository";
import ICategory from "../../database/model/categoryModel";
import ProductRepository from "../../database/repositories/productRepository";

export const getCategories: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await CategoryRepository.findCategories(req.query);
    res.status(200).json({
      results: data.length,
      payload: {
        categories: data,
      },
    });
  }
);

export const createCategory: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, products } = req.body;
    const isExist = await CategoryRepository.findCategoryByObject({
      name: name.toLowerCase(),
    });
    if (isExist)
      return next(new HttpError("this category is already exist", 400));
    const invalidProducts: Types.ObjectId[] = [];
    const validProducts: Types.ObjectId[] = [];

    for (let i = 0; i < products.length; i++) {
      const product = await ProductRepository.findProductByObject({
        _id: products[i],
      });
      if (!product) invalidProducts.push(products[i]);
      else validProducts.push(product._id);
    }
    if (validProducts.length == 0)
      return next(new HttpError("invalid products", 404));
    const doc = await CategoryRepository.createCategory({
      name: name.toLowerCase(),
      products: validProducts,
      [req?.file?.fieldname]: req?.file?.path,
    } as ICategory);
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
  }
);

export const updateCategory: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, products } = req.body;

    if (name) {
      const isExist = await CategoryRepository.findCategoryByObject({
        name,
      });
      if (isExist) return next(new HttpError("try another name", 400));
    }
    const invalidProducts: Types.ObjectId[] = [];
    const validProducts: Types.ObjectId[] = [];

    for (let i = 0; i < products?.length; i++) {
      const product = await ProductRepository.findProductByObject({
        _id: products[i],
      });
      if (!product) invalidProducts.push(products[i]);
      else validProducts.push(product._id);
    }
    const doc = await CategoryRepository.updateCategoryById(
      new Types.ObjectId(id),
      {
        ...req.body,
        ...(validProducts.length > 0 && { products: validProducts }),
        [req?.file?.fieldname]: req?.file?.path,
      }
    );
    if (!doc)
      return next(
        new HttpError("can not update category with id : " + id, 400)
      );
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
  }
);

export const deleteCategory: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const doc = await CategoryRepository.deleteCategoryById(
      new Types.ObjectId(id)
    );
    if (!doc)
      return next(
        new HttpError(`can't delete category with this ID : ${id}`, 404)
      );
    res.status(204).json({});
  }
);
