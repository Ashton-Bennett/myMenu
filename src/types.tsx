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
  name: string;
  servings: number;
  ingredients: string[];
  prepTime: number;
  directions: string[];
  category: Category;
  region: Region;
  country: string;
  story: string;
}

export interface InputFieldProps {
  type: string;
  label: string;
  newRecipe: Recipe;
  setNewRecipe: Function;
  name: string | undefined;
  value: string | number;
}
