import jwt from "jsonwebtoken";

class JwtService {
  private readonly secret = process.env.JWT_SECRET!;

  generateToken(payload: { id: string; role: string }) {
    return jwt.sign(payload, this.secret, {
      expiresIn: "1d",
    });
  }

  verifyToken(token: string) {
    return jwt.verify(token, this.secret);
  }
}

export const jwtService = new JwtService();