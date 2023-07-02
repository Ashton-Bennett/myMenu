import axios, { AxiosResponse } from "axios";
import { Ingredient } from "../types";

const baseUrl = "/api/myGroceryList/";

// all endpoints will need to include user id, then myGroceryList. Like: `/api/user/${id}/myGroceryList`

const getGroceryList = async (
  id: string | undefined
): Promise<Ingredient[] | undefined> => {
  try {
    const response: AxiosResponse<Ingredient[]> = await axios.get<Ingredient[]>(
      `${baseUrl}/myGroceryList/${id}`
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
    const response = await axios.put(
      `${baseUrl}/myGroceryList/${id}`,
      updatedList
    );
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const clearList = async (id: string) => {
  try {
    const response = await axios.delete(`${baseUrl}/myGroceryList/${id}`);
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

//Add item(s)
//update items(s)
//Delete item(s)
//Clear all item(s)
//Create List
