import axios from "axios";
import Cookies from "js-cookie";
import { urlConfig } from "@/configs/config.url";
import { AXIOS_CONFIG } from "@/configs/config.axios";
import { RemoveAuthCookie, SetAuthCookie } from "@/utils/authCookieHandler";
const axiosInstance = axios.create(AXIOS_CONFIG);

const MAX_RETRY_ATTEMPTS = 3;

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");
    const clientId = Cookies.get("clientId");

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    if (refreshToken) {
      config.headers["x-rtoken-id"] = refreshToken;
    }
    if (clientId) {
      config.headers["x-client-id"] = clientId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    originalRequest._retryCount = originalRequest._retryCount || 0;

    if (
      error.response &&
      error.response.status &&
      error.response.status === 401
    ) {
      if (originalRequest._retryCount < MAX_RETRY_ATTEMPTS) {
        originalRequest._retryCount += 1;

        try {
          const response = await axiosInstance.post(
            `${urlConfig.AUTH}/api/auth/refresh-token`,
            {},
            {
              headers: {
                "x-rtoken-id": Cookies.get("refreshToken"),
              },
            }
          );

          const { tokens, user } = response.data.metadata;

          SetAuthCookie(tokens, user);

          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${tokens.accessToken}`;
          originalRequest.headers["x-client-id"] = user._id;

          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token failed: ", refreshError);
        }
      }
      RemoveAuthCookie();
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
