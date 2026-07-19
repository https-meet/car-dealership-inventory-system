// Reads the authenticated user from localStorage.
// Avoids repeating JSON.parse(localStorage.getItem("user")) across components.

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
}

export function useAuth(): AuthUser | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function useIsAdmin(): boolean {
  const user = useAuth();
  return user?.role === "ADMIN";
}

export function useIsCustomer(): boolean {
  const user = useAuth();
  return user?.role === "CUSTOMER";
}
