import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "@prisma/client";

interface TokenPayload {
  id: string;
  role: Role;
}

class JwtService {
  private readonly secret = process.env.JWT_SECRET!;

  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: "1d",
    });
  }

  verifyToken(token: string): TokenPayload {
    const decoded = jwt.verify(token, this.secret) as JwtPayload;

    return {
      id: decoded.id,
      role: decoded.role as Role,
    };
  }
}

export const jwtService = new JwtService();