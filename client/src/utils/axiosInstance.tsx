import axios from "axios";
import auth from "../services/auth";

const axiosInstance = axios.create({
  withCredentials: true, // important for cookies
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log("request");
    const token = auth.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("Response error:", error);
    const prevRequest = error?.config;

    if (error?.response?.status === 401 && !prevRequest?.sent) {
      prevRequest.sent = true;
      console.log("Unauthorized, redirecting to login");
      window.location.href = "/login?unauth=true";
      return Promise.reject(error);
    }

    if (error?.response?.status === 403 && !prevRequest?.sent) {
      prevRequest.sent = true;
      try {
        const newAccessToken = await auth.refreshToken();

        if (!newAccessToken) {
          console.error("Failed to refresh token");
          window.location.href = "/login";
          return Promise.reject(error);
        }

        auth.setAccessToken(newAccessToken.accessToken);
        prevRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(prevRequest);
      } catch (refreshError) {
        console.log("Refresh token error:", refreshError);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
