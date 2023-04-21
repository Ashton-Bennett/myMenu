import React from "react";
import { Recipe } from "../types";

export interface recipes {
  recipes: Recipe[];
}

const RecipeList = ({ recipes }: recipes) => {
  return (
    <>
      <h2> Recipes:</h2>
      {recipes.map((recipe, i) => {
        return <p key={recipe.name + i}>{recipe.name}</p>;
      })}
    </>
  );
};

export default RecipeList;
