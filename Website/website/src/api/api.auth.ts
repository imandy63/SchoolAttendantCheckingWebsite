import { LoginInterface } from "@/interfaces/auth.interface";
import axiosInstance from ".";
import { urlConfig } from "@/configs/config.url";
import { RemoveAuthCookie, SetAuthCookie } from "@/utils/authCookieHandler";

const loginUser = async (credentials: LoginInterface) => {
  try {
    const response = await axiosInstance.post(
      `${urlConfig.AUTH}/api/auth/login`,
      credentials
    );

    const { tokens, user } = response.data.metadata;

    SetAuthCookie(tokens, user);

    return response.data;
  } catch (error) {
    console.error("Login failed: ", error);
    throw error;
  }
};

const logoutUser = async () => {
  const response = await axiosInstance.post(
    `${urlConfig.AUTH}/api/auth/logout`
  );
  RemoveAuthCookie();
  return response.data.metadata;
};

const verifyUser = async () => {
  const response = await axiosInstance.get(
    `${urlConfig.AUTH}/api/auth/authenticate`
  );
  return response.data.metadata;
};

const isAdmin = async () => {
  const response = await axiosInstance.get(
    `${urlConfig.AUTH}/api/auth/is-admin`
  );
  return response.data.metadata;
};

const isUnionWorker = async () => {
  const response = await axiosInstance.get(
    `${urlConfig.AUTH}/api/auth/is-union-worker`
  );
  return response.data.metadata;
};

const getMe = async () => {
  const response = await axiosInstance.get(`${urlConfig.AUTH}/api/auth/me`);
  return response.data.metadata;
};

export { loginUser, logoutUser, verifyUser, isAdmin, isUnionWorker, getMe };
