import { AxiosResponse } from "axios";
import { Menu } from "../types";
import axios from "../utils/axiosInstance";

const baseUrl = "/api/menus";

//Is likely not being currently used though..
//This could be used for admin viewing how users are using the app:
const getAll = async (): Promise<Menu[] | undefined> => {
  try {
    const response: AxiosResponse<Menu[]> = await axios.get<Menu[]>(baseUrl);
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const getAllPublic = async (): Promise<Menu[] | undefined> => {
  try {
    const response: AxiosResponse<Menu[]> = await axios.get<Menu[]>(
      `${baseUrl}/public`
    );
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const getAllFromSingleUser = async (
  userId: string
): Promise<Menu[] | undefined> => {
  try {
    const response: AxiosResponse<Menu[]> = await axios.get<Menu[]>(
      `${baseUrl}/private/${userId}`
    );
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const getSingleMenu = async (id: string | undefined) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}`);
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const addMenu = async (
  newMenuName: string,
  userId: string,
  isPublic: boolean
) => {
  try {
    const newMenuObj = {
      name: newMenuName,
      items: [],
      isPublic: isPublic,
      createdById: userId,
    };
    const response = await axios.post(baseUrl, newMenuObj);
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const deleteMenu = async (id: string) => {
  try {
    const response = await axios.delete(`${baseUrl}/${id}`);
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const updateMenu = async (id: string | undefined, updatedMenu: Menu) => {
  try {
    const response = await axios.put(`${baseUrl}/${id}`, updatedMenu);
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAll,
  getAllPublic,
  getAllFromSingleUser,
  getSingleMenu,
  addMenu,
  deleteMenu,
  updateMenu,
};
