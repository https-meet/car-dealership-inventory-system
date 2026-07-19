import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  const response = await authService.registerUser(req.body);

  res.status(response.statusCode).json(response.body);
};

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Login Body:", req.body);

  const response = await authService.loginUser(req.body);

  res.status(response.statusCode).json(response.body);
};