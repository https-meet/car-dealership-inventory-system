export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: "ADMIN" | "CUSTOMER";
  };
}