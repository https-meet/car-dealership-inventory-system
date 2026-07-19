export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string; // The database UUID is String
    firstName: string;
    lastName: string;
    email: string;
    role: "ADMIN" | "CUSTOMER";
  };
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: "ADMIN" | "CUSTOMER";
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "ADMIN" | "CUSTOMER";
  };
}
