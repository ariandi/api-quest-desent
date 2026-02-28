import { TokenResponse } from "../types";

class AuthService {
  private readonly validTokens: Set<string> = new Set();

  generateToken(): TokenResponse {
    const raw = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
    const token = Buffer.from(raw).toString("base64url");
    this.validTokens.add(token);
    return { token };
  }

  validateToken(token: string): boolean {
    return this.validTokens.has(token);
  }
}

export const authService = new AuthService();
