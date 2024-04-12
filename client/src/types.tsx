type Category = "dinner" | "cocktail" | "other" | "";

type Region =
  | "north american"
  | "south american"
  | "european"
  | "asian"
  | "african"
  | "";

export interface Ingredient {
  name: string;
  alias: string[];
  pairings: string[];
  season: Season[];
  groceryListId?: string;
  checked?: boolean;
  amount?: number | string;
  unitOfMeasure?: string | undefined;
  groceryStoreLocation: groceryStoreLocation;
  id?: string;
}

export interface Heading {
  id: string;
  heading: boolean;
  text: string;
  groceryListId?: string;
}

export type IngredientOrHeading = Ingredient | Heading;

export interface Recipe {
  id: string | null | undefined;
  name: string;
  servings: number;
  ingredients: IngredientOrHeading[];
  cookTime: number;
  prepTime: number;
  directions: string[];
  category: Category;
  region: Region;
  country: string;
  story: string;
  drinkPairings: string;
  checked: boolean;
  notes: string;
  menuItemId?: string;
  isMenuDuplicate: boolean;
}

export interface Recipe {
  name: string;
  servings: number;
  ingredients: IngredientOrHeading[];
  cookTime: number;
  prepTime: number;
  directions: string[];
  category: "dinner" | "cocktail" | "other" | "";
  region:
    | "north american"
    | "south american"
    | "european"
    | "asian"
    | "african"
    | "";
  country: string;
  story: string;
  drinkPairings: string;
  checked: boolean;
  notes: string;
  menuItemId?: string;
}

export interface Menu {
  id?: string | undefined;
  name: string;
  items: Recipe[];
  isPublic: boolean;
  createdById: string;
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

export type Season =
  | "Summer"
  | "Spring"
  | "Fall"
  | "Winter"
  | "Year Round"
  | "";

export type groceryStoreLocation =
  | "deli"
  | "produce"
  | "middle aisles"
  | "meat department"
  | "frozen"
  | "dairy"
  | "other"
  | "unknown"
  | undefined;

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
  userStapleIngredients: {
    itemsToNeverAdd: Ingredient[];
    quickAddItems: Ingredient[];
  };
}

export function isHeading(object: IngredientOrHeading): object is Heading {
  return "text" in object;
}
