import * as authService from "../services/auth.service.js";
import type { Request, Response, NextFunction } from "express";
import createError from "http-errors";

/**
 *
 * @param req this is a request
 * @param res
 * @param next
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.body;

    const result = await authService.register({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    const { otp } = req.body;
    res.send(await authService.verifyEmail(email, otp));
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;

    res.json(await authService.forgotPassword(email));
  } catch (error) {
    next(error);
  }
};

export const verifyResetOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp } = req.body;

    res.json(await authService.verifyResetOtp(email, otp));
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, newPassword } = req.body;

    res.json(await authService.resetPassword(email, newPassword));
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;

    res.json(
      await authService.changePassword(userId, currentPassword, newPassword),
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login({
      email,
      password,
    });

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 60 * 1000,
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.cookies;

    const result = await authService.refreshToken(refreshToken);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const profile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;

    if (!user) {
      throw createError(401, "Not authenticated");
    }

    const { password: _password, ...safeUser } = user;

    res.json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};
