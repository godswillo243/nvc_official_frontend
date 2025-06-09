import env from "../../../constants/env";

const API_BASE_URL = "https://nvc-api.onrender.com/users";
const TOKEN_KEY = "nvc_auth_token";
const REFRESH_TOKEN_KEY = "nvc_refresh_token";

export interface UserSignupData {
  name: string;
  email: string;
  password: string;
  nin: string;
  phone_number: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refresh_token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

// ================== Token Management ==================
export function storeTokens(token: string, refreshToken?: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ================== API Client ==================
async function apiClient(
  endpoint: string,
  method: string = "GET",
  body?: any,
  customHeaders: Record<string, string> = {}
): Promise<any> {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": env.VITE_API_KEY,
    ...(getAccessToken() && { Authorization: `Bearer ${getAccessToken()}` }),
    ...customHeaders,
  };

  const config: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle 401 Unauthorized by attempting token refresh
    if (response.status === 401 && endpoint !== "/refresh-token") {
      const refreshed = await refreshToken();
      if (refreshed) {
        return apiClient(endpoint, method, body, customHeaders); // Retry original request
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        message: errorData.detail || "Request failed",
        status: response.status,
        details: errorData,
      } as ApiError;
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// ================== Auth Functions ==================
export async function signup(data: UserSignupData): Promise<AuthResponse> {
  const formData = {
    name: data.name.trim(),
    email: data.email.trim(),
    password: data.password,
    phone_number: data.phone_number.trim(),
    nin: data.nin.trim(),
  };

  const response = await apiClient("/", "POST", formData);
  if (response.token) {
    storeTokens(response.token, response.refresh_token);
  }
  return response;
}

export async function login(data: UserLoginData): Promise<AuthResponse> {
  const response = await apiClient("/login", "POST", {
    email: data.email.trim(),
    password: data.password,
  });

  if (response.token) {
    storeTokens(response.token, response.refresh_token);
  }
  return response;
}

export async function logout(): Promise<void> {
  try {
    await apiClient("/logout", "POST");
  } finally {
    clearTokens();
  }
}

export async function refreshToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.VITE_API_KEY,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      storeTokens(data.token, data.refresh_token);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
}

export async function verifyEmail(token: string): Promise<void> {
  await apiClient("/verify-email", "POST", { token });
}

export async function requestPasswordReset(email: string): Promise<void> {
  await apiClient("/request-password-reset", "POST", { email });
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<void> {
  await apiClient("/reset-password", "POST", { token, new_password: newPassword });
}

export async function getCurrentUser(): Promise<any> {
  return apiClient("/me", "GET");
}

// ================== Auth Status Check ==================
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

// Initialize token refresh interval
let refreshInterval: NodeJS.Timeout;

export function startTokenRefresh(): void {
  refreshInterval = setInterval(async () => {
    if (isAuthenticated()) {
      await refreshToken();
    }
  }, 5 * 60 * 1000); // Refresh every 5 minutes
}

export function stopTokenRefresh(): void {
  clearInterval(refreshInterval);
}
