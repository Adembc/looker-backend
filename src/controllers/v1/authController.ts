import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import HttpError from "../../helper/HttpError";
import catchAsync from "../../helper/catchAsync";
import user from "../../database/model/userModel";
import UserRepository from "../../database/repositories/userRepository";
import TokenRepository from "../../database/repositories/tokenRepository";
import { TokenInterface } from "../../types/token";
import { Types } from "mongoose";
import filePath from "../../helper/filePath";

export const register: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phone, email, firstName, lastName, password } = req.body;
    const identifier = phone || email;
    const existingUser = await UserRepository.findUserByObject(
      {
        $or: [{ phone: identifier }, { email: identifier }],
      },
      "+verified +completed"
    );
    if (existingUser) {
      return next(new HttpError("email already exists", 400));
    }

    const createdUser = await UserRepository.createUser({
      phone,
      email,
      firstName,
      lastName,
      password,
      [req?.file?.fieldname]: filePath(req?.file?.path),
    } as user);
    if (!createdUser) {
      return next(new HttpError("Could not register this user", 500));
    }
    const accessToken = createdUser.generateToken(
      { id: createdUser.id },
      process.env.JWT_SECRET_STRING,
      process.env.JWT_EXPIRES
    );
    const refreshToken = createdUser.generateToken(
      { id: createdUser.id },
      process.env.JWT_SECRET_STRING_REFRESH,
      process.env.JWT_EXPIRES_REFRESH
    );
    await TokenRepository.createToken({ refreshToken });
    res.status(201).json({
      status: "success",
      accessToken,
      refreshToken,
    });
  }
);

export const check: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, phone } = req.body;
    const identifier = email || phone;

    const user = await UserRepository.findUserByObject({
      $or: [{ phone: identifier }, { email: identifier }],
    });
    if (user)
      return res.status(400).json({
        code: 400,
        status: "fail",
      });
    res.status(200).json({
      code: 200,
      status: "success",
    });
  }
);

export const login: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, phone, password, deviceId } = req.body;
    const identifier = email || phone;
    const users = await UserRepository.findUsersByObject(
      {
        $or: [{ phone: identifier }, { email: identifier }],
      },
      "+verified +password"
    );
    if (users && users?.length === 0)
      return next(new HttpError("Please sign up !", 404));
    let isCorrectPwd = false;
    let user: user;
    for (let i = 0; i < users.length; i++) {
      if (await users[i].isCorrectPassword(password, users[i].password)) {
        isCorrectPwd = true;
        user = users[i];
        break;
      }
    }
    if (!isCorrectPwd)
      return next(new HttpError("Please Provide credentials Correctly", 404));
    const accessToken = user.generateToken(
      { id: user.id },
      process.env.JWT_SECRET_STRING,
      process.env.JWT_EXPIRES
    );
    const refreshToken = user.generateToken(
      { id: user.id },
      process.env.JWT_SECRET_STRING_REFRESH,
      process.env.JWT_EXPIRES_REFRESH
    );
    await TokenRepository.createToken({ refreshToken });
    res.status(200).json({
      status: "success",
      accessToken,
      refreshToken,
    });
  }
);

export const refreshToken: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;
    const token = await TokenRepository.findTokenByObject({ refreshToken });
    if (!token) return next(new HttpError("INVALID REFRESH TOKEN !", 404));
    const decoded = jwt.verify(
      token.refreshToken,
      process.env.JWT_SECRET_STRING_REFRESH
    ) as TokenInterface;
    const currentUser = await UserRepository.findUserById(
      new Types.ObjectId(decoded.id)
    );
    if (!currentUser)
      return next(new HttpError("INVALID REFRESH TOKEN !", 404));
    const accessToken = currentUser.generateToken(
      { id: currentUser.id },
      process.env.JWT_SECRET_STRING,
      process.env.JWT_EXPIRES
    );
    const refreshTokenGenerated = currentUser.generateToken(
      { id: currentUser.id },
      process.env.JWT_SECRET_STRING_REFRESH,
      process.env.JWT_EXPIRES_REFRESH
    );
    await TokenRepository.findTokenAndDelete({ refreshToken });
    await TokenRepository.createToken({ refreshToken: refreshTokenGenerated });
    res.status(200).json({
      status: "success",
      accessToken,
      refreshToken: refreshTokenGenerated,
    });
  }
);

export const protect: RequestHandler = catchAsync(
  async (req, res: Response, next: NextFunction) => {
    let token: string;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) return next(new HttpError("You're Not Logged In ! ", 401));
    // 2 verify
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_STRING
    ) as TokenInterface;
    // 3 check if user still exist
    const currentUser = await UserRepository.findUserById(
      new Types.ObjectId(decoded.id),
      "+verified +completed"
    );
    if (!currentUser)
      return next(new HttpError("User is no longer exist ! ", 404));
    //4 check if change psw after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat))
      return next(
        new HttpError("User recently change psw ! login again ", 401)
      );
    //5 check if user account in verified
    // if (!currentUser.verified)
    //   return next(
    //     new HttpError(
    //       "you can not access this route until you verify you account",
    //       401
    //     )
    //   );
    req.user = currentUser;
    next();
  }
);

export const logout: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;
    const token = await TokenRepository.findTokenAndDelete({ refreshToken });
    if (!token) return next(new HttpError("Invalid Token", 404));
    res.status(204).json({});
  }
);
