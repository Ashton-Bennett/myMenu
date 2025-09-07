import { AxiosResponse } from "axios";
import axios from "../utils/axiosInstance";
import { User } from "../types";
const baseUrl = "/api/user";

const getAll = async (): Promise<User[] | undefined> => {
  try {
    const response: AxiosResponse<User[]> = await axios.get<User[]>(baseUrl);
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const getSingleUser = async (id: string | undefined) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}`);
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const addUser = async (name: string, password: string, email: string) => {
  const newUserCredentials = { name, password, email };

  try {
    const response = await axios.post(baseUrl, newUserCredentials);
    return {
      success: true,
      statusCode: response.status,
      data: response.data,
    };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      statusCode: error.response?.status ?? 500,
      error: error.response?.data?.error || "Something went wrong",
    };
  }
};

const deleteUser = async (id: string) => {
  try {
    const response = axios.delete(`${baseUrl}/${id}`);
    if (response) {
      return response;
    }
  } catch (error) {
    console.error(error);
  }
};

const updateUser = (id: string | undefined, updatedUser: User) => {
  try {
    const response = axios.put(`${baseUrl}/${id}`, updatedUser);
    if (response) {
      return response;
    }
  } catch (error) {
    console.error(error);
  }
};

const resetUserPassword = (id: string | undefined) => {
  try {
    const response = axios.put(`${baseUrl}/resetPassword/${id}`);
    if (response) {
      return response;
    }
  } catch (error) {
    console.error(error);
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAll,
  deleteUser,
  getSingleUser,
  addUser,
  updateUser,
  resetUserPassword,
};
