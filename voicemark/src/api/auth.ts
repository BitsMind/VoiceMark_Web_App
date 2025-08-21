import API from "@/utils/axiosClient";
import { UserType, User } from "@/types/role";
import { AxiosResponse } from "axios";
import { toast } from "sonner";

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  account: {
    id: string;
    email: string;
    isVerified: boolean;
    lastLogin: string;
    userType: UserType;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

// Simple encryption for localStorage (basic security)
class TokenCrypto {
  private static key = 'your-app-secret-key'; // In production, use env variable

  static encrypt(text: string): string {
    try {
      const combined = text + '|' + this.key;
      return btoa(combined);
    } catch {
      return text;
    }
  }

  static decrypt(encryptedText: string): string {
    try {
      const decoded = atob(encryptedText);
      return decoded.split('|')[0];
    } catch {
      return encryptedText;
    }
  }
}

class TokenManager {
  private static instance: TokenManager;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private accessTokenTimer: NodeJS.Timeout | null = null;
  private readonly ACCESS_TOKEN_KEY = 'app_access_token';
  private readonly REFRESH_TOKEN_KEY = 'app_refresh_token';

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
      // Load tokens from localStorage on initialization
      TokenManager.instance.loadTokensFromStorage();
    }
    return TokenManager.instance;
  }

  private loadTokensFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      // Load refresh token (persistent)
      const storedRefreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      if (storedRefreshToken) {
        this.refreshToken = TokenCrypto.decrypt(storedRefreshToken);
      }

      // Load access token (check if still valid)
      const storedAccessToken = sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
      if (storedAccessToken) {
        this.accessToken = TokenCrypto.decrypt(storedAccessToken);
        
        // Set timer for access token
        this.setAccessTokenTimer();
      }

      console.log("Tokens loaded from storage:", {
        hasAccessToken: !!this.accessToken,
        hasRefreshToken: !!this.refreshToken
      });
    } catch (error) {
      console.error("Error loading tokens from storage:", error);
      this.clearTokens();
    }
  }

  private setAccessTokenTimer(): void {
    if (this.accessTokenTimer) {
      clearTimeout(this.accessTokenTimer);
    }
    
    // Clear access token after 29 minutes (1 min before expiry)
    this.accessTokenTimer = setTimeout(() => {
      this.accessToken = null;
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
      }
      console.log("Access token expired");
    }, 29 * 60 * 1000);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    
    if (typeof window !== 'undefined') {
      // Store access token in sessionStorage (cleared on tab close)
      sessionStorage.setItem(this.ACCESS_TOKEN_KEY, TokenCrypto.encrypt(accessToken));
      
      // Store refresh token in localStorage (persistent across browser restarts)
      localStorage.setItem(this.REFRESH_TOKEN_KEY, TokenCrypto.encrypt(refreshToken));
    }
    
    this.setAccessTokenTimer();
    console.log("Tokens stored successfully");
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

    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    }
    
    console.log("All tokens cleared");
  }

  hasValidAccessToken(): boolean {
    return !!this.accessToken;
  }
}

const tokenManager = TokenManager.getInstance();

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshComplete = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

API.interceptors.request.use(
  (config) => {
    const accessToken = tokenManager.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
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

        const refreshResponse = await API.post("/api/auth/refresh", {
          refreshToken: refreshToken
        });

        if (refreshResponse.data.tokens) {
          const newAccessToken = refreshResponse.data.tokens.accessToken;
          const newRefreshToken = refreshResponse.data.tokens.refreshToken;
          
          tokenManager.setTokens(newAccessToken, newRefreshToken);
          onRefreshComplete(newAccessToken);
          
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return API(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        tokenManager.clearTokens();
        toast.error("Session expired. Please log in again.");
        
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
    
    await API.post("/api/auth/logout", {
      refreshToken: refreshToken
    });
    
    tokenManager.clearTokens();
    console.log("User successfully logged out.");
  } catch (error) {
    console.error("Failed to sign out:", error);
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
    );

    if (response.data.tokens) {
      tokenManager.setTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      );
      console.log("Login successful, tokens stored persistently");
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

    if (response.data.tokens) {
      tokenManager.setTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      );
    }

    return response;
  } catch (error) {
    console.error("Signup failed:", error);
    throw error;
  }
}

export async function getMe(): Promise<User> {
  try {
    const response: AxiosResponse<AuthResponse> = await API.get("/api/auth/me");
    return extractUserInfo(response.data);
  } catch (error) {
    console.error("getMe failed:", error);
    toast.error("Failed to get user info, please log in again");
    throw error;
  }
}

// Initialize authentication on app load
export async function initializeAuth(): Promise<User | null> {
  try {
    // Check if we have tokens
    if (!tokenManager.hasValidAccessToken() && tokenManager.getRefreshToken()) {
      // Try to refresh the access token
      const refreshToken = tokenManager.getRefreshToken();
      const refreshResponse = await API.post("/api/auth/refresh", {
        refreshToken: refreshToken
      });

      if (refreshResponse.data.tokens) {
        tokenManager.setTokens(
          refreshResponse.data.tokens.accessToken,
          refreshResponse.data.tokens.refreshToken
        );
      }
    }

    // If we have an access token, get user info
    if (tokenManager.hasValidAccessToken()) {
      return await getMe();
    }
    
    return null;
  } catch (error) {
    console.error("Auth initialization failed:", error);
    tokenManager.clearTokens();
    return null;
  }
}

export function isAuthenticated(): boolean {
  return tokenManager.hasValidAccessToken();
}

export function clearAuthTokens(): void {
  tokenManager.clearTokens();
}