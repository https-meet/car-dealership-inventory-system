import { userRepository } from "../repositories/user.repository";
import { RegisterUserInput } from "../types/auth.types";

class AuthService {
  async registerUser(data: RegisterUserInput) {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      return {
        statusCode: 409,
        body: {
          success: false,
          message: "Email already exists",
        },
      };
    }

    const user = await userRepository.create(data);

    return {
      statusCode: 201,
      body: {
        success: true,
        message: "User registered successfully",
        user,
      },
    };
  }
}

export const authService = new AuthService();