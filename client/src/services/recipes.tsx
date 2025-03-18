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

const getSingleMenuInstanceRecipe = async (id: string | undefined) => {
  try {
    const response = await axios.get(`viewMenuRecipe/${id}`);
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

const addRecipe = async (newRecipe: Recipe, ImageFile: File | null) => {
  const DirectionsArrayWithoutEmptyStrings = newRecipe.directions.filter(
    (direction) => {
      return direction.length < 1 ? false : true;
    }
  );
  newRecipe = { ...newRecipe, directions: DirectionsArrayWithoutEmptyStrings };
  if (newRecipe.servings <= 0) {
    newRecipe.servings = 1;
  }

  const formData = new FormData();
  formData.append("newRecipe", JSON.stringify(newRecipe)); // Send newRecipe as a JSON string
  if (ImageFile) formData.append("file", ImageFile);

  try {
    const response = await axios.post(baseUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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

const updateRecipe = async (
  id: string | undefined,
  updatedRecipe: Recipe,
  ImageFile: File | null
) => {
  const DirectionsArrayWithoutEmptyStrings = updatedRecipe.directions.filter(
    (direction) => {
      return direction.length < 1 ? false : true;
    }
  );
  updatedRecipe = {
    ...updatedRecipe,
    directions: DirectionsArrayWithoutEmptyStrings,
  };

  const formData = new FormData();
  formData.append("updatedRecipe", JSON.stringify(updatedRecipe)); // Send newRecipe as a JSON string
  if (ImageFile) formData.append("file", ImageFile);

  // try {
  //   const response = axios.put(`${baseUrl}/${id}`, updatedRecipe);
  //   if (response) {
  //     return response;
  //   }
  // }
  //
  try {
    const response = await axios.put(`${baseUrl}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const getFormattedRecipe = async (recipeString: string): Promise<any> => {
  const formattedRecipeString = { recipe: recipeString };

  try {
    const response = await axios.get(`${baseUrl}/recipe-upload`, {
      params: formattedRecipeString,
    });

    if (response) {
      return response.data[0].message.content;
    }

    console.error("Unexpected response format:", response);
    return null;
  } catch (error) {
    console.error("Error during recipe upload:", error);
    throw error;
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getFormattedRecipe,
  getAll,
  deleteRecipe,
  getSingleRecipe,
  addRecipe,
  updateRecipe,
  getSingleMenuInstanceRecipe,
};
