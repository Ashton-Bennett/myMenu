import { Ingredient } from "../types";
import { v4 as uuidv4 } from "uuid";

const findIngredientShoppingLocationAndAddID = (
  item: Ingredient
): Ingredient => {
  return { ...item, groceryListId: uuidv4() };
};

export default findIngredientShoppingLocationAndAddID;
