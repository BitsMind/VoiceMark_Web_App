// ===== FRONTEND: Updated auth.ts =====
import API from "@/utils/axiosClient";
import { UserType, User } from "@/types/role";
import { AxiosResponse } from "axios";
import { toast } from "sonner";

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    accountId: string;
  };
  account: {
    id: string;
    email: string;
    isVerified: boolean;
    lastLogin: string;
    userType: UserType;
  };
  // Add tokens to match your backend response
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

// Token storage utility for cross-domain setup
class TokenManager {
  private static instance: TokenManager;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private accessTokenTimer: NodeJS.Timeout | null = null;

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    
    // Clear existing timer
    if (this.accessTokenTimer) {
      clearTimeout(this.accessTokenTimer);
    }
    
    // Set timer to clear access token after 30 minutes
    this.accessTokenTimer = setTimeout(() => {
      this.accessToken = null;
      console.log("Access token expired in memory");
    }, 29 * 60 * 1000); // Clear 1 minute before actual expiry

    console.log("Tokens stored successfully in memory");
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    if (this.accessTokenTimer) {
      clearTimeout(this.accessTokenTimer);
      this.accessTokenTimer = null;
    }
    console.log("All tokens cleared");
  }

  hasValidAccessToken(): boolean {
    return !!this.accessToken;
  }
}

const tokenManager = TokenManager.getInstance();

// Setup axios interceptors
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

// Function to add subscribers waiting for token refresh
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Function to notify all subscribers when refresh is complete
const onRefreshComplete = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

// Request interceptor to add Authorization header
API.interceptors.request.use(
  (config) => {
    const accessToken = tokenManager.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, wait for the refresh to complete
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(API(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Attempt to refresh the token
        const refreshResponse = await API.post("/api/auth/refresh", {
          refreshToken: refreshToken
        });

        if (refreshResponse.data.tokens) {
          const newAccessToken = refreshResponse.data.tokens.accessToken;
          const newRefreshToken = refreshResponse.data.tokens.refreshToken;
          
          tokenManager.setTokens(newAccessToken, newRefreshToken);
          
          // Notify all waiting requests
          onRefreshComplete(newAccessToken);
          
          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return API(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        tokenManager.clearTokens();
        toast.error("Session expired. Please log in again.");
        
        // Optionally redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export function extractUserInfo(response: AuthResponse): User {
  return {
    id: response.user.id,
    name: response.user.name,
    email: response.user.email,
    userType: response.account.userType,
  };
}

export async function signOut(): Promise<void> {
  try {
    const refreshToken = tokenManager.getRefreshToken();
    
    // Send logout request with refresh token in body
    await API.post("/api/auth/logout", {
      refreshToken: refreshToken
    });
    
    // Clear local tokens
    tokenManager.clearTokens();
    console.log("User successfully logged out.");
  } catch (error) {
    console.error("Failed to sign out:", error);
    // Clear tokens even if logout request fails
    tokenManager.clearTokens();
  }
}

export async function login(values: {
  email: string;
  password: string;
}): Promise<User> {
  try {
    const response: AxiosResponse<AuthResponse> = await API.post(
      "/api/auth/login",
      values
      // Removed withCredentials since we're using Authorization headers
    );

    // Store tokens from response
    if (response.data.tokens) {
      tokenManager.setTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      );
      console.log("Login successful, tokens stored");
    } else {
      console.warn("No tokens received in login response");
    }

    return extractUserInfo(response.data);
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function userSignup(values: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const response: AxiosResponse<AuthResponse> = await API.post(
      "/api/auth/signup",
      values
    );

    // Store tokens if they're returned after signup
    if (response.data.tokens) {
      tokenManager.setTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      );
      console.log("Signup successful, tokens stored");
    }

    return response;
  } catch (error) {
    console.error("Signup failed:", error);
    throw error;
  }
}

export async function getMe(): Promise<User> {
  try {
    // This will automatically include Authorization header via interceptor
    const response: AxiosResponse<AuthResponse> = await API.get("/api/auth/me");
    return extractUserInfo(response.data);
  } catch (error) {
    console.error("getMe failed:", error);
    toast.error("Failed to get user info, please log in again");
    throw error;
  }
}

// Utility functions
export function isAuthenticated(): boolean {
  return tokenManager.hasValidAccessToken();
}

export function clearAuthTokens(): void {
  tokenManager.clearTokens();
}

// For debugging purposes
export function getStoredTokens() {
  return {
    accessToken: tokenManager.getAccessToken(),
    refreshToken: tokenManager.getRefreshToken(),
  };
}