import axios, { AxiosResponse } from "axios";
import { Ingredient } from "../types";

const baseUrl = "/api/ingredients";

const getAll = async (): Promise<Ingredient[] | undefined> => {
  try {
    const response: AxiosResponse<Ingredient[]> = await axios.get<Ingredient[]>(
      baseUrl
    );
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const getSingleIngredient = async (id: string | undefined) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}`);
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const addIngredient = async (newIngredient: Ingredient) => {
  try {
    const response = await axios.post(baseUrl, newIngredient);
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const deleteIngredient = async (id: string) => {
  try {
    const response = axios.delete(`${baseUrl}/${id}`);
    if (response) {
      return response;
    }
  } catch (error) {
    console.error(error);
  }
};

const updateIngredient = (
  id: string | undefined,
  updatedIngredient: Ingredient
) => {
  try {
    const response = axios.put(`${baseUrl}/${id}`, updatedIngredient);
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
  deleteIngredient,
  getSingleIngredient,
  addIngredient,
  updateIngredient,
};
