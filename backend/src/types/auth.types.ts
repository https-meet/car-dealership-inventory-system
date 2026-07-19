import { Role } from "@prisma/client";

export interface RegisterUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: Role;
}

export interface LoginUserInput {
  email: string;
  password: string;
}
