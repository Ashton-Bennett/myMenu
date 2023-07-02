import axios, { AxiosResponse } from "axios";
import { Menu } from "../types";

const baseUrl = "/api/menus";

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

const addMenu = async (newMenuName: string) => {
  try {
    const newMenuObj = { name: newMenuName, items: [] };
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
  getSingleMenu,
  addMenu,
  deleteMenu,
  updateMenu,
};
