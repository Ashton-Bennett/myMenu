import axios, { AxiosResponse } from "axios";
import { Recipe } from "../types";
const baseUrl = "/api/recipes";

const getAll = async (): Promise<Recipe[] | undefined> => {
  try {
    const response: AxiosResponse<Recipe[]> = await axios.get<Recipe[]>(
      baseUrl
    );
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const getSingleRecipe = (id: string | undefined) => {
  return axios.get(`${baseUrl}/${id}`);
};

const addRecipe = (newRecipe: Recipe) => {
  return axios.post(baseUrl, newRecipe);
};

const deleteRecipe = (id: string) => {
  return axios.delete(`${baseUrl}/${id}`);
};

const updateRecipe = (id: string | undefined, updatedRecipe: Recipe) => {
  return axios.put(`${baseUrl}/${id}`, updatedRecipe);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAll,
  deleteRecipe,
  getSingleRecipe,
  addRecipe,
  updateRecipe,
};
