import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import recipeService from "../services/recipes";
import { Ingredient, Recipe } from "../types";
import BackButton from "../components/BackButton";

const RecipeView = () => {
  const [recipe, setRecipe] = useState<Recipe>();
  const { id } = useParams();

  useEffect(() => {
    recipeService.getSingleRecipe(id).then((response) => {
      setRecipe(response);
    });
  }, []);

  return (
    <section>
      {recipe ? (
        <>
          <h1>{recipe.name}</h1>
          <p>
            Time to prepare: {recipe.prepTime} mins.{" "}
            {recipe.cookTime && <>To cook:{recipe.cookTime} mins.</>}
          </p>
          {recipe.prepTime && recipe.cookTime && (
            <p>
              Total time:{Number(recipe.prepTime) + Number(recipe.cookTime)}{" "}
              mins.
            </p>
          )}
          <p>Serves: {recipe.servings} people</p>
          <p>
            Region {recipe.region}, country {recipe.country}
          </p>
          {recipe.story !== "Unknown" ? <p>Story:{recipe.story}</p> : null}
          <br></br>
          <h3>Ingredients:</h3>
          {recipe.ingredients.map((ingredientOrHeading) => {
            if ("name" in ingredientOrHeading) {
              const ingredient = ingredientOrHeading as Ingredient;
              return (
                <p key={ingredient.name}>
                  {ingredient.name} - {ingredient.amount}{" "}
                  {ingredient.unitOfMeasure}
                </p>
              );
            } else {
              return <strong>{ingredientOrHeading.text}</strong>;
            }
          })}
          <br></br>
          <h3>Directions:</h3>
          {recipe.directions.map((direction) => {
            return <p key={direction}>{direction}</p>;
          })}
          {recipe.notes && (
            <>
              <h3>Notes:</h3>
              {recipe?.notes}
              <br></br>
              <br></br>
              <br></br>
            </>
          )}
        </>
      ) : (
        <p>Oops... Looks like this recipe is missing.</p>
      )}

      <BackButton linkTo={undefined} />
    </section>
  );
};

export default RecipeView;
