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

const getSingleMenu = (id: string | undefined) => {
  return axios.get(`${baseUrl}/${id}`);
};

const addMenu = (newMenuName: string) => {
  const newMenuObj = { name: newMenuName, items: [] };
  return axios.post(baseUrl, newMenuObj);
};

const deleteMenu = (id: string) => {
  return axios.delete(`${baseUrl}/${id}`);
};

const updateMenu = (id: string | undefined, updatedMenu: Menu) => {
  return axios.put(`${baseUrl}/${id}`, updatedMenu);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAll,
  getSingleMenu,
  addMenu,
  deleteMenu,
  updateMenu,
};
