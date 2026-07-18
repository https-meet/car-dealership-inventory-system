import { userRepository } from "../repositories/user.repository";
import { RegisterUserInput } from "../types/auth.types";
import { passwordService } from "./password.service";
import { LoginUserInput } from "../types/auth.types";
import { jwtService } from "./jwt.service";
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

    async loginUser(data: LoginUserInput) {
    const user = await userRepository.findByEmail(data.email);

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
        user.password
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
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        },
    };
}
}

export const authService = new AuthService();