import { LoginInterface } from "@/interfaces/auth.interface";
import axiosInstance from ".";
import { urlConfig } from "@/configs/config.url";
import { RemoveAuthCookie, SetAuthCookie } from "@/utils/authCookieHandler";
import { CreateUnionWorkerPayload } from "@/interfaces/unionWorker.interface";
import axios from "axios";

const loginUser = async (credentials: LoginInterface) => {
  try {
    console.log('Attempting login with:', credentials);
    const response = await axiosInstance.post(
      `${urlConfig.AUTH}/api/auth/login`,
      credentials
    );
    console.log('Login response:', response.data);

    const { tokens, user } = response.data.metadata;
    SetAuthCookie(tokens, user);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Login failed:", {
        message: error.message,
        response: error.response?.data || "No response data",
        status: error.response?.status || "No status code"
      });
    } else {
      console.error("An unexpected error occurred:", error);
    }
    
    throw error;
  }
};

const logoutUser = async () => {
  try {
    const response = await axiosInstance.post(
      `${urlConfig.AUTH}/api/auth/logout`
    );
    RemoveAuthCookie();
    return response.data.metadata;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

const verifyUser = async () => {
  try {
    const response = await axiosInstance.get(
      `${urlConfig.AUTH}/api/auth/authenticate`
    );
    return response.data.metadata;
  } catch (error) {
    console.error("Verification failed:", error);
    throw error;
  }
};

const isAdmin = async () => {
  try {
    const response = await axiosInstance.get(
      `${urlConfig.AUTH}/api/auth/is-admin`
    );
    return response.data.metadata;
  } catch (error) {
    console.error("Admin check failed:", error);
    throw error;
  }
};

const isUnionWorker = async () => {
  try {
    const response = await axiosInstance.get(
      `${urlConfig.AUTH}/api/auth/is-union-worker`
    );
    return response.data.metadata;
  } catch (error) {
    console.error("Union worker check failed:", error);
    throw error;
  }
};

const getMe = async () => {
  try {
    const response = await axiosInstance.get(`${urlConfig.AUTH}/api/auth/me`);
    return response.data.metadata;
  } catch (error) {
    console.error("Get me failed:", error);
    throw error;
  }
};

export const resetUnionWorkerPasswordAPI = async (
  id: string,
  newPassword: string
) => {
  try {
    const response = await axiosInstance.put(
      `${urlConfig.AUTH}/api/auth/${id}/reset-password`,
      { password: newPassword }
    );
    return response.data.metadata;
  } catch (error) {
    console.error("Password reset failed:", error);
    throw error;
  }
};

export const createUnionWorkerAPI = async ({
  student_id,
  password,
  student_name,
}: CreateUnionWorkerPayload) => {
  try {
    const response = await axiosInstance.post(`${urlConfig.AUTH}/api/auth`, {
      student_id,
      password,
      student_name,
    });
    return response.data.metadata;
  } catch (error) {
    console.error("Create union worker failed:", error);
    throw error;
  }
};

export { loginUser, logoutUser, verifyUser, isAdmin, isUnionWorker, getMe };
