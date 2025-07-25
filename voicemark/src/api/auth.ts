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
}

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
    await API.post("api/auth/logout", {}, { withCredentials: true });
    console.log("User successfully logged out.");
  } catch (error) {
    console.error("Failed to sign out:", error);
  }
}

export async function login(values: {
  email: string;
  password: string;
}): Promise<User> {
  try {
    const response: AxiosResponse<AuthResponse> = await API.post(
      "/api/auth/login",
      values,
      {
        withCredentials: true,
      }
    );

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
      values,
    );

    return response;

  } catch (error) {
    console.error("Signup failed:", error);
    throw error;
  }
}

export async function getMe(): Promise<User> {
  try {
    const response: AxiosResponse<AuthResponse> = await API.get(
      "/api/auth/me",
      {
        withCredentials: true,
      }
    );
    return extractUserInfo(response.data);
  } catch (error) {
    toast.error("Failed to get user info, please log in again")
    throw error;
  }
}
