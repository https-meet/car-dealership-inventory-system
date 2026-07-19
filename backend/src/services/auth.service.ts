import { User } from "@prisma/client";
import { userRepository } from "../repositories/user.repository";
import { LoginUserInput, RegisterUserInput } from "../types/auth.types";
import { jwtService } from "./jwt.service";
import { passwordService } from "./password.service";

type PublicUser = Omit<User, "password">;

function toPublicUser(user: User): PublicUser {
  const { password, ...publicUser } = user;
  return publicUser;
}

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

    const hashedPassword = await passwordService.hash(data.password);
    const user = await userRepository.create({
      ...data,
      email: data.email.toLowerCase(),
      password: hashedPassword,
    });

    return {
      statusCode: 201,
      body: {
        success: true,
        message: "User registered successfully",
        user: toPublicUser(user),
      },
    };
  }

  async loginUser(data: LoginUserInput) {
    const user = await userRepository.findByEmail(data.email.toLowerCase());

    if (!user) {
      return {
        statusCode: 401,
        body: {
          success: false,
          message: "Invalid email or password",
        },
      };
    }

    const isPasswordValid = await passwordService.compare(
      data.password,
      user.password,
    );

    if (!isPasswordValid) {
      return {
        statusCode: 401,
        body: {
          success: false,
          message: "Invalid email or password",
        },
      };
    }

    const token = jwtService.generateToken({
      id: user.id,
      role: user.role,
    });

    return {
      statusCode: 200,
      body: {
        success: true,
        message: "Login successful",
        token,
        user: toPublicUser(user),
      },
    };
  }
}

export const authService = new AuthService();
