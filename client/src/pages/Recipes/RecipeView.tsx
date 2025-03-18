import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import recipeService from "../../services/recipes";
import { Ingredient, Recipe, isHeading } from "../../types";
import BackButton from "../../components/BackButton";
import ServingsAmountInput from "../../components/Menus/ServingsAmountInput";
import { baseImgURL } from "../../oraclePath";

interface componentProps {
  isMenuRecipe: boolean;
}

const RecipeView = ({ isMenuRecipe }: componentProps) => {
  const [recipe, setRecipe] = useState<Recipe>();
  const { id } = useParams();

  useEffect(() => {
    if (isMenuRecipe) {
      recipeService.getSingleRecipe(id).then((response) => {
        setRecipe(response);
      });
    } else {
      recipeService.getSingleRecipe(id).then((response) => {
        setRecipe(response);
      });
    }
  }, []);

  const handleRecipeServingAmountChange = (e: any) => {
    if (recipe) {
      const menuItemBaseServings = recipe.servings;
      const AmountToAddToEachIngredientAmount =
        e.target.value / menuItemBaseServings;
      const updatedIngredients = recipe.ingredients.map((ingredient) => {
        if (!isHeading(ingredient) && ingredient.amount !== undefined) {
          return {
            ...ingredient,
            amount: parseFloat(
              (
                Number(ingredient.amount) *
                Number(AmountToAddToEachIngredientAmount)
              ).toFixed(2)
            ).toString(),
          };
        }

        return ingredient;
      });
      const updatedRecipe = {
        ...recipe,
        servings: e.target.value,
        ingredients: updatedIngredients,
      };

      setRecipe(updatedRecipe);
    }
  };

  return (
    <section>
      {recipe ? (
        <>
          <h1>{recipe.name}</h1>
          {recipe.imgName && (
            <img
              alt={recipe.name}
              src={baseImgURL + recipe.imgName + "?t=" + new Date().getTime()}
            />
          )}
          <p>
            Time to prepare: {recipe.prepTime} mins.{" "}
            {recipe.cookTime && <>To cook: {recipe.cookTime} mins.</>}
          </p>
          {recipe.prepTime && recipe.cookTime && (
            <p>
              Total time: {Number(recipe.prepTime) + Number(recipe.cookTime)}{" "}
              mins.
            </p>
          )}
          <ServingsAmountInput
            handleRecipeServingAmountChange={handleRecipeServingAmountChange}
            menuItem={recipe}
          />
          <p>
            Region {recipe.region}, country {recipe.country}
          </p>
          {recipe.story !== "Unknown" ? <p>Story:{recipe.story}</p> : null}
          <br></br>
          <h3>Ingredients:</h3>
          {recipe.ingredients.map((ingredientOrHeading, i) => {
            if ("name" in ingredientOrHeading) {
              const ingredient = ingredientOrHeading as Ingredient;
              return (
                <p key={ingredient.name + i}>
                  {ingredient.name} - {ingredient.amount}{" "}
                  {ingredient.unitOfMeasure}
                </p>
              );
            } else {
              return (
                <strong key={i + "heading"}>{ingredientOrHeading.text}</strong>
              );
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
