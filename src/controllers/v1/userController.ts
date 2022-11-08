import { NextFunction, RequestHandler, Response } from "express";
import catchAsync from "../../helper/catchAsync";
import HttpError from "../../helper/HttpError";
import UserRepository from "../../database/repositories/userRepository";
import paginateData from "../../helper/paginateData";
import user, { User } from "../../database/model/userModel";
import { Types } from "mongoose";
import { ProtectedRequest } from "../../types/ProtectedRequest";

export const getUsers: RequestHandler = catchAsync(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const data = await UserRepository.paginate(
      req.query,
      "-verifCode -verifCodeExpires"
    );
    if (!data) return next(new HttpError("can not get users", 500));
    const options = {
      dataName: "users",
      isPaginated: !!req.query.limit,
    };
    res.status(200).json(paginateData(data, options));
  }
);

export const createUser: RequestHandler = catchAsync(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { email, phone } = req.body;
    const identifier = phone || email;
    const existingUser = await UserRepository.findUserByObject({
      $or: [{ phone: identifier }, { email: identifier }],
    });
    if (existingUser)
      return next(
        new HttpError("this identifier is already has an  account", 400)
      );

    const doc = await UserRepository.createUser({
      ...req.body,
      [req?.file?.fieldname]: req?.file?.path,
    } as user);
    if (!doc)
      return next(new HttpError(`can't create this user ! try later :( `, 500));
    const user = {
      _id: doc._id,
      firstName: doc.firstName,
      lastName: doc.lastName,
      phone: doc.phone,
      email: doc.email,
      avatar: doc?.avatar,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
    res.status(201).json({
      code: 201,
      status: "success",
      payload: {
        user,
      },
    });
  }
);

export const getUser: RequestHandler = catchAsync(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const doc = await UserRepository.findUserById(new Types.ObjectId(id));
    if (!doc)
      return next(new HttpError(`can't find user with this ID : ${id}`, 404));
    doc.password = undefined;
    doc.passwordChangedAt = undefined;
    res.status(200).json({
      code: 200,
      status: "success",
      payload: {
        user: doc,
      },
    });
  }
);

export const updateUser: RequestHandler = catchAsync(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { email, phone } = req.body;
    const identifier = phone || email;
    if (identifier) {
      const existingUser = await UserRepository.findUserByObject({
        $or: [{ phone: identifier }, { email: identifier }],
      });
      if (existingUser)
        return next(new HttpError("this identifier is already exist", 400));
    }

    const doc = await UserRepository.updateUserById(new Types.ObjectId(id), {
      ...req.body,
      [req?.file?.fieldname]: req?.file.path,
    });
    if (!doc)
      return next(new HttpError("can not update user with id : " + id, 400));
    const user = {
      _id: doc?._id,
      email: doc?.email,
      firstName: doc?.firstName,
      lastName: doc?.lastName,
      avatar: doc?.avatar,
      createdAt: doc?.createdAt,
      updatedAt: doc?.updatedAt,
      phone: doc?.phone,
    };
    return res.status(200).json({
      code: 200,
      status: "success",
      payload: {
        user,
      },
    });
  }
);

export const deleteUser: RequestHandler = catchAsync(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const doc = await UserRepository.updateUserById(new Types.ObjectId(id), {
      deletedAt: new Date(),
    });
    if (!doc)
      return next(new HttpError(`can't delete user with this ID : ${id}`, 404));
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export const getMe = (req, res: Response, next: NextFunction) => {
  req.params.id = req.user._id;
  next();
};

export const updatePassword: RequestHandler = catchAsync(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { currentPassword, password, passwordConfirm } = req.body;
    // 1) Get user from collection
    const user = await UserRepository.findUserById(req.user.id, "+password");
    // 2) Check if posted current password is correct
    if (!(await user.isCorrectPassword(currentPassword, user.password))) {
      return next(new HttpError("Your current password is wrong.", 401));
    }
    // 3 check psw and psw confirm
    if (password !== passwordConfirm)
      return next(
        new HttpError(
          "password and password confirm are not identical :( , try again",
          400
        )
      );
    // 4) If so, update password
    user.password = req.body.password;
    await UserRepository.saveUser(user);
    res.status(200).json({
      code: 200,
      status: "success",
    });
  }
);

export const removeAvatar: RequestHandler = catchAsync(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const userId = req.user._id;
    if (!req.user.avatar)
      return next(new HttpError("you are already without avatar ", 400));
    const user = await UserRepository.updateUserById(userId, { avatar: null });
    if (!user)
      return next(new HttpError("can not remove avatar try later", 500));
    res.status(200).json({
      code: 200,
      status: "success",
      payload: { user },
    });
  }
);
export const getUserProfile: RequestHandler = catchAsync(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const userId = req.user._id;
    return res.status(200).json({
      code: 200,
      status: "success",
      payload: {
        user: {
          _id: userId,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          email: req.user.email,
          avatar: req.user.avatar,
        },
      },
    });
  }
);
