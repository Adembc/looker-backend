import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import HttpError from "../../helper/HttpError";
import catchAsync from "../../helper/catchAsync";
import TokenRepository from "../../database/repositories/tokenRepository";
import AdminRepository from "../../database/repositories/adminRepository";
import { TokenInterface } from "../../types/token";

export const login: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await AdminRepository.findAdminByObject(
      { email },
      "+password"
    );

    if (!user || !(await user.isCorrectPassword(password, user.password)))
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
    if (!token) return next(new HttpError("Token does not exist", 401));
    const decoded = (await jwt.verify(
      token.refreshToken,
      process.env.JWT_SECRET_STRING_REFRESH
    )) as TokenInterface;
    const currentUser = await AdminRepository.findAdminById(decoded.id);
    if (!currentUser)
      return next(new HttpError("INVALID REFRESH TOKEN ! ", 404));
    const accessToken = currentUser.generateToken(
      { id: currentUser.id },
      process.env.JWT_SECRET_STRING,
      process.env.JWT_EXPIRES
    );
    res.status(200).json({
      status: "success",
      accessToken,
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
    const currentUser = await AdminRepository.findAdminById(decoded.id);
    if (!currentUser) return next(new HttpError("Admin not  exist ! ", 404));
    //4 check if change psw after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat))
      return next(
        new HttpError("admin recently change psw ! login again ", 401)
      );
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
