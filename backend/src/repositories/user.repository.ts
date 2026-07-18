import { prisma } from "../config/prisma";
import { RegisterUserInput } from "../types/auth.types";


class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
  async create(data: RegisterUserInput) {
  return prisma.user.create({
    data,
  });
}
}

export const userRepository = new UserRepository();