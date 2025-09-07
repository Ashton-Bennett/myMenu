import axiosL from "axios";
import axios from "../utils/axiosInstance";

const baseUrl = "/api/auth";

let accessToken: string | null = null;

const getAccessToken = () => {
  return accessToken;
};

const removeAccessToken = () => {
  accessToken = null;
};

const setAccessToken = (newToken: string) => {
  accessToken = newToken;
  return;
};

const login = async (name: string, password: string) => {
  try {
    const response = await axios.post(baseUrl, { name, password });
    accessToken = response.data.accessToken;
    return { success: true, data: response.data };
  } catch (error: any) {
    if (axiosL.isAxiosError(error) && error.response) {
      return {
        success: false,
        error: error.response.data.error || "Login failed",
      };
    }
    return { success: false, error: "Network error" };
  }
};

const logout = async (): Promise<string | undefined> => {
  try {
    const response = await axios.get(`${baseUrl}/logout`);
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const refreshToken = async () => {
  try {
    const response = await fetch(`${baseUrl}/refreshToken`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setAccessToken(data.accessToken);
    return data;
  } catch (error) {
    console.error("Error refreshing token:", error);
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  login,
  logout,
  refreshToken,
  getAccessToken,
  removeAccessToken,
  setAccessToken,
};
