import { NextFunction, RequestHandler, Response, Request } from "express";
import catchAsync from "../../helper/catchAsync";
import HttpError from "../../helper/HttpError";
import AdminRepository from "../../database/repositories/adminRepository";
import paginateData from "../../helper/paginateData";
import admin from "../../database/model/adminModel";

export const getAdmins: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await AdminRepository.paginate(req.query);
    if (!data) return next(new HttpError("can not get admins", 500));
    const options = {
      dataName: "admins",
      isPaginated: !!req.query.limit,
    };
    res.status(200).json(paginateData(data, options));
  }
);

export const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const existingUser = await AdminRepository.findAdminByObject({ email });
    if (existingUser)
      return next(
        new HttpError("this identifier is already has an active account", 400)
      );
    const doc = await AdminRepository.createAdmin(req.body as admin);
    if (!doc)
      return next(
        new HttpError(`can't create this admin ! try later :( `, 500)
      );
    doc.password = undefined;
    res.status(201).json({
      code: 201,
      status: "success",
      payload: {
        admin: doc,
      },
    });
  }
);

export const getAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const doc = await AdminRepository.findAdminById(id);
    if (!doc)
      return next(new HttpError(`can't find admin with this ID : ${id}`, 404));
    doc.passwordChangedAt = undefined;
    res.status(200).json({
      code: 200,
      status: "success",
      payload: {
        admin: doc,
      },
    });
  }
);

export const updateAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { email } = req.body;
    if (email) {
      const existingUser = await AdminRepository.findAdminByObject({ email });
      if (existingUser)
        return next(
          new HttpError("this identifier is already has an active account", 400)
        );
    }

    const doc = await AdminRepository.updateAdminById(id, req.body);
    res.status(200).json({
      code: 200,
      status: "success",
      payload: {
        admin: doc,
      },
    });
  }
);

export const deleteAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const doc = await AdminRepository.updateAdminById(id, {
      deletedAt: new Date(),
    });
    if (!doc)
      return next(
        new HttpError(`can't delete admin with this ID : ${id}`, 404)
      );
    res.status(204).json({});
  }
);

export const getMe = (req, res: Response, next: NextFunction) => {
  req.params.id = req.user._id;
  next();
};

export const updatePassword = catchAsync(
  async (req, res: Response, next: NextFunction) => {
    const { currentPassword, password } = req.body;
    // 1) Get user from collection
    const user = await AdminRepository.findAdminById(req.user._id, "+password");

    // 2) Check if posted current password is correct
    if (!(await user.isCorrectPassword(currentPassword, user.password))) {
      return next(new HttpError("Your current password is wrong.", 401));
    }
    // 3) If so, update password
    user.password = password;
    await AdminRepository.saveAdmin(user);
    res.status(200).json({
      code: 200,
      status: "success",
    });
  }
);
