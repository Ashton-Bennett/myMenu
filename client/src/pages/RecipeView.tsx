import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import recipeService from "../services/recipes";
import { Recipe } from "../types";
import BackButton from "../components/BackButton";

const RecipeView = () => {
  const [recipe, setRecipe] = useState<Recipe>();
  const { id } = useParams();

  useEffect(() => {
    recipeService.getSingleRecipe(id).then((response) => {
      setRecipe(response.data);
    });
  }, []);

  return (
    <section>
      {recipe ? (
        <>
          <h1>{recipe.name}</h1>
          <p>Approximate time to prepare {recipe.prepTime} mins.</p>
          <p>Serves: {recipe.servings} people</p>
          <p>
            Region {recipe.region}, country {recipe.country}
          </p>
          {recipe.story !== "Unknown" ? <p>Story:{recipe.story}</p> : null}
          <br></br>
          <h3>Ingredients:</h3>
          {recipe.ingredients.map((ingredient) => {
            return <p key={ingredient}>{ingredient}</p>;
          })}
          <br></br>
          <h3>Directions:</h3>
          {recipe.directions.map((direction) => {
            return <p key={direction}>{direction}</p>;
          })}
        </>
      ) : (
        <p>Oops... Looks like this recipe is missing.</p>
      )}
      <BackButton linkTo={undefined} />
    </section>
  );
};

export default RecipeView;
