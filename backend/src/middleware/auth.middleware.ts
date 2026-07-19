import { Request, Response, NextFunction } from "express";
import { jwtService } from "../services/jwt.service";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      success: false,
      message: "Authorization header missing",
    });
    return;
  }

  if (!authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Invalid authorization format",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwtService.verifyToken(token);

    req.user = payload;

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};