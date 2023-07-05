import axios, { AxiosResponse } from "axios";
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

const addUser = async (newUser: User) => {
  try {
    const response = await axios.post(baseUrl, newUser);
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
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

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAll,
  deleteUser,
  getSingleUser,
  addUser,
  updateUser,
};
