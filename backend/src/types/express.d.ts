import { Role } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
      };
    }
  }
}

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      role: Role;
    };
  }
}

export {};