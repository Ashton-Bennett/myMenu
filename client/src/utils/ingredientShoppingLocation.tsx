import { Ingredient } from "../types";
import { produceItems } from "./ingredientLookups/produce";
import { dairyItems } from "./ingredientLookups/dairy";
import { deliItems } from "./ingredientLookups/deli";
import { meatDepartmentItems } from "./ingredientLookups/meatDepartment";
import { middleAislesItems } from "./ingredientLookups/middleAisles";
import { v4 as uuidv4 } from "uuid";

// const findIngredientShoppingLocationAndAddID = (
//   item: Ingredient
// ): Ingredient => {
//   console.log(item);
//   const itemName = item.name.toLocaleLowerCase().trim();

//   switch (true) {
//     case produceItems.hasOwnProperty(itemName):
//       return { ...item, groceryStoreLocation: "produce", id: uuidv4() };
//     case dairyItems.hasOwnProperty(itemName):
//       return { ...item, groceryStoreLocation: "dairy", id: uuidv4() };
//     case deliItems.hasOwnProperty(itemName):
//       return { ...item, groceryStoreLocation: "deli", id: uuidv4() };
//     case meatDepartmentItems.hasOwnProperty(itemName):
//       return { ...item, groceryStoreLocation: "meat department", id: uuidv4() };
//     case middleAislesItems.hasOwnProperty(itemName):
//       return { ...item, groceryStoreLocation: "middle aisles", id: uuidv4() };
//     case itemName.includes("frozen") ||
//       itemName.includes("Frozen") ||
//       itemName.includes("FRZ"):
//       return { ...item, groceryStoreLocation: "frozen", id: uuidv4() };
//     default:
//       return { ...item, groceryStoreLocation: "unknown", id: uuidv4() };
//   }
// };

const findIngredientShoppingLocationAndAddID = (
  item: Ingredient
): Ingredient => {
  return { ...item, groceryListId: uuidv4() };
};

export default findIngredientShoppingLocationAndAddID;
