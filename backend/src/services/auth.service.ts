import { userRepository } from "../repositories/user.repository";
import { RegisterUserInput } from "../types/auth.types";
import { passwordService } from "./password.service";

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

        // Hash the password
        const hashedPassword = await passwordService.hash(data.password);

        // Create a new object with the hashed password
        const userData = {
            ...data,
            password: hashedPassword,
        };

        // Save the user
        const user = await userRepository.create(userData);
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