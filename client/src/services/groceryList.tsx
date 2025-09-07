import { AxiosResponse } from "axios";
import { Ingredient } from "../types";
import axios from "../utils/axiosInstance";

const baseUrl = "/api/myGroceryList";

const getGroceryList = async (
  id: string | undefined
): Promise<Ingredient[] | undefined> => {
  try {
    const response: AxiosResponse<Ingredient[]> = await axios.get<Ingredient[]>(
      `${baseUrl}/${id}`
    );
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const updateGroceryList = async (
  id: string | undefined,
  updatedList: Ingredient[]
) => {
  try {
    const response = await axios.put(`${baseUrl}/${id}`, updatedList);
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const clearList = async (id: string) => {
  try {
    const response = await axios.delete(`${baseUrl}/${id}`);
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getGroceryList,
  updateGroceryList,
  clearList,
};
