type Category = "dinner" | "cocktail" | "other" | "";

type Region =
  | "north american"
  | "central american"
  | "south american"
  | "european"
  | "asian"
  | "african"
  | "";

export interface Recipe {
  id: string | null | undefined;
  name: string;
  servings: number;
  ingredients: Ingredient[];
  prepTime: number;
  directions: string[];
  category: Category;
  region: Region;
  country: string;
  story: string;
  drinkPairings: string;
  checked: boolean;
}

export interface Menu {
  id?: string | undefined;
  name: string;
  items: Recipe[];
}

export interface InputFieldProps {
  type: string;
  label: string;
  newRecipe: Recipe;
  setNewRecipe: Function;
  name: string | undefined;
  value: string | number;
  required: boolean;
}

export interface UpdateInputFieldProps {
  type: string;
  label: string;
  newRecipe: Recipe;
  setNewRecipe: Function;
  name: string | undefined;
  value: string | number;
}

export interface Ingredient {
  name: string;
  checked?: boolean;
  amount: number | string;
  unitOfMeasure?: string | undefined;
  groceryStoreLocation: string;
  id?: string;
}

export interface itemUserAddedToGroceryList {
  name: string;
  amount: string;
  groceryStoreLocation: string;
}

export interface User {
  name: string;
  userRecipes: Recipe[];
  userGroceryList: Ingredient[];
  userMenus: Menu[];
  id: string;
}
