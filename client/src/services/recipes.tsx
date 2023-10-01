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

const getSingleRecipe = async (id: string | undefined) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}`);
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const addRecipe = async (newRecipe: Recipe) => {
  console.log("service", newRecipe);
  try {
    const response = await axios.post(baseUrl, newRecipe);
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const deleteRecipe = async (id: string) => {
  try {
    const response = axios.delete(`${baseUrl}/${id}`);
    if (response) {
      return response;
    }
  } catch (error) {
    console.error(error);
  }
};

const updateRecipe = (id: string | undefined, updatedRecipe: Recipe) => {
  try {
    const response = axios.put(`${baseUrl}/${id}`, updatedRecipe);
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
  deleteRecipe,
  getSingleRecipe,
  addRecipe,
  updateRecipe,
};
