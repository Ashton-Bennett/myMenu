import { Ingredient } from "../types";
import { v4 as uuidv4 } from "uuid";

const addGroceryListIdAndRecipeRefToIngredient = (
  item: Ingredient,
  recipeName?: string
): Ingredient => {
  if (recipeName) {
    return { ...item, groceryListId: uuidv4(), recipeRef: [recipeName] };
  }
  return { ...item, groceryListId: uuidv4() };
};

export default addGroceryListIdAndRecipeRefToIngredient;
