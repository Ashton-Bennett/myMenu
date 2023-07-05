import { Ingredient } from "../types";
import { produceItems } from "./ingredientLookups/produce";
import { dairyItems } from "./ingredientLookups/dairy";
import { deliItems } from "./ingredientLookups/deli";
import { meatDepartmentItems } from "./ingredientLookups/meatDepartment";
import { middleAislesItems } from "./ingredientLookups/middleAisles";

const findIngredientShoppingLocation = (item: Ingredient): Ingredient => {
  const itemName = item.name.toLocaleLowerCase().trim();

  switch (true) {
    case produceItems.hasOwnProperty(itemName):
      return { ...item, groceryStoreLocation: "produce" };
    case dairyItems.hasOwnProperty(itemName):
      return { ...item, groceryStoreLocation: "dairy" };
    case deliItems.hasOwnProperty(itemName):
      return { ...item, groceryStoreLocation: "deli" };
    case meatDepartmentItems.hasOwnProperty(itemName):
      return { ...item, groceryStoreLocation: "meat department" };
    case middleAislesItems.hasOwnProperty(itemName):
      return { ...item, groceryStoreLocation: "middle aisles" };
    case itemName.includes("frozen") ||
      itemName.includes("Frozen") ||
      itemName.includes("FRZ"):
      return { ...item, groceryStoreLocation: "frozen" };
    default:
      return { ...item, groceryStoreLocation: "unknown" };
  }
};

export default findIngredientShoppingLocation;
