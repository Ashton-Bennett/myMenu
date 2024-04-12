import { useEffect, useState } from "react";
import { Ingredient, Recipe, isHeading } from "../../types";
import InputField from "../../components/Recipes/RecipeForm/InputField";
import InputFieldRadio from "../../components/Recipes/RecipeForm/InputFieldRadio";
import CountryInput from "../../components/Recipes/RecipeForm/CountryInput";
import recipeService from "../../services/recipes";
import BackButton from "../../components/BackButton";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import IngredientInput from "../../components/Recipes/RecipeForm/IngredientInput";
import NotesTextArea from "../../components/Recipes/RecipeForm/NotesTextArea";
import HeadingInput from "../../components/Recipes/RecipeForm/HeadingInput";
import { v4 as uuidv4 } from "uuid";

interface recipeFormProps {
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
}

const UpdateRecipeForm = ({ recipes, setRecipes }: recipeFormProps) => {
  const { id } = useParams();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await recipeService.getSingleRecipe(id);
        const recipe: Recipe = response;

        const insureTheIngredientsHaveAnIdForPlacement = recipe.ingredients.map(
          (ingredient) => {
            if (isHeading(ingredient)) return ingredient;
            if (ingredient.groceryListId) return ingredient;
            return { ...ingredient, groceryListId: uuidv4() };
          }
        );
        setRecipeToUpdate({
          ...recipe,
          ingredients: insureTheIngredientsHaveAnIdForPlacement,
        });
      } catch (error) {
        console.log("Error fetching recipe", error);
      }
    };
    fetchRecipe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [recipeToUpdate, setRecipeToUpdate] = useState<Recipe>({
    id: null,
    name: "",
    servings: 0,
    ingredients: [],
    prepTime: 0,
    cookTime: 0,
    directions: [""],
    category: "",
    region: "",
    country: "",
    story: "",
    drinkPairings: "",
    checked: false,
    notes: "",
    isMenuDuplicate: false,
  });

  const navigate = useNavigate();

  const handleAddIngredient = (type: string) => {
    setRecipeToUpdate({
      ...recipeToUpdate,
      ingredients: [
        ...recipeToUpdate.ingredients,
        type === "ingredient"
          ? {
              name: "",
              alias: [],
              season: [],
              pairings: [""],
              groceryListId: uuidv4(),
              checked: false,
              amount: undefined,
              unitOfMeasure: undefined,
              groceryStoreLocation: "other",
            }
          : {
              id: uuidv4(),
              heading: true,
              text: "",
            },
      ],
    });
  };

  const handleAddDirection = () => {
    setRecipeToUpdate({
      ...recipeToUpdate,
      directions: [...recipeToUpdate.directions, ""],
    });
  };

  const locationChange = (
    direction: "up" | "down",
    key: number,
    arrayToChange: "directions" | "ingredients"
  ): void => {
    setRecipeToUpdate((prev) => {
      const updatedRecipe = { ...prev };

      if (arrayToChange === "directions") {
        const directions = [...updatedRecipe.directions];
        const currentLocation = directions.indexOf(directions[key]);

        if (direction === "up" && currentLocation > 0) {
          const movingInput = directions.splice(currentLocation, 1);
          directions.splice(currentLocation - 1, 0, movingInput[0]);
        } else if (
          direction === "down" &&
          currentLocation < directions.length - 1
        ) {
          const movingInput = directions.splice(currentLocation, 1);
          directions.splice(currentLocation + 1, 0, movingInput[0]);
        }

        updatedRecipe.directions = directions;
      } else if (arrayToChange === "ingredients") {
        const ingredients = [...updatedRecipe.ingredients];
        const currentLocation = ingredients.indexOf(ingredients[key]);

        if (direction === "up" && currentLocation > 0) {
          const movingInput = ingredients.splice(currentLocation, 1);
          ingredients.splice(currentLocation - 1, 0, movingInput[0]);
        } else if (
          direction === "down" &&
          currentLocation < ingredients.length - 1
        ) {
          const movingInput = ingredients.splice(currentLocation, 1);
          ingredients.splice(currentLocation + 1, 0, movingInput[0]);
        }

        updatedRecipe.ingredients = ingredients;
      }

      return updatedRecipe;
    });
  };

  const addRecipe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isConfirmed = window.confirm(
      `This updates the recipe in the recipe list but doesn't affect any versions of the recipe currently in a menu.`
    );

    if (isConfirmed) {
      const updatedIngredientsToNumberType = recipeToUpdate.ingredients.map(
        (ingredientOrHeading) => {
          if ("amount" in ingredientOrHeading) {
            const ingredient = ingredientOrHeading as Ingredient;
            return { ...ingredient, amount: Number(ingredient.amount) };
          } else {
            return ingredientOrHeading;
          }
        }
      );

      const updatedIngredientsToAllIncludeAlias =
        updatedIngredientsToNumberType.map((ingredientOrHeading) => {
          if (
            "amount" in ingredientOrHeading &&
            ingredientOrHeading.alias.length === 0
          ) {
            const ingredient = ingredientOrHeading as Ingredient;
            return { ...ingredient, id: uuidv4(), alias: [ingredient.name] };
          } else {
            return ingredientOrHeading;
          }
        });

      const updatedNewRecipeWithAliasAndNumbers = {
        ...recipeToUpdate,
        ingredients: updatedIngredientsToAllIncludeAlias,
      };

      recipeService.updateRecipe(id, updatedNewRecipeWithAliasAndNumbers);
      // eslint-disable-next-line eqeqeq
      const newRecipeList = recipes.filter((recipe) => recipe.id != id);
      setRecipes([...newRecipeList, recipeToUpdate]);
      navigate(-1);
    }

    return;
  };

  return (
    <form onSubmit={addRecipe}>
      <h2>Edit Recipe</h2>
      <InputField
        name="name"
        value={recipeToUpdate.name}
        type="text"
        label="Name of recipe"
        setNewRecipe={setRecipeToUpdate}
        newRecipe={recipeToUpdate}
        required={true}
      />
      <InputField
        name="servings"
        value={recipeToUpdate.servings}
        type="number"
        label="Serves"
        setNewRecipe={setRecipeToUpdate}
        newRecipe={recipeToUpdate}
        required={false}
      />
      <>
        <label>Ingredients/amount </label>
        {recipeToUpdate.ingredients.map((value, i) => {
          return (
            <div
              key={`${value.id} + ${value.groceryListId}`}
              style={{ display: "flex" }}
            >
              {isHeading(value) ? (
                <HeadingInput
                  i={i}
                  newRecipe={recipeToUpdate}
                  setNewRecipe={setRecipeToUpdate}
                  isUpdateInput={true}
                  value={value}
                />
              ) : (
                <IngredientInput
                  i={i}
                  newRecipe={recipeToUpdate}
                  setNewRecipe={setRecipeToUpdate}
                  isUpdateInput={true}
                  value={value}
                />
              )}

              <button
                type="button"
                data-testid={`direction${i}ButtonUp`}
                onClick={() => locationChange("up", i, "ingredients")}
              >
                Move up
              </button>
              <button
                type="button"
                data-testid={`direction${i}ButtonDown`}
                onClick={() => locationChange("down", i, "ingredients")}
              >
                Move down
              </button>
            </div>
          );
        })}
        <button type="button" onClick={() => handleAddIngredient("ingredient")}>
          + ingredient
        </button>
        <button type="button" onClick={() => handleAddIngredient("heading")}>
          + heading
        </button>
        <br></br>
      </>
      <InputField
        name="cookTime"
        value={recipeToUpdate.cookTime}
        type="number"
        label="Cook time(mins)"
        setNewRecipe={setRecipeToUpdate}
        newRecipe={recipeToUpdate}
        required={false}
      />
      <InputField
        name="prepTime"
        value={recipeToUpdate.prepTime}
        type="number"
        label="Prep time(mins)"
        setNewRecipe={setRecipeToUpdate}
        newRecipe={recipeToUpdate}
        required={false}
      />
      <>
        <label>Directions </label>
        {recipeToUpdate.directions.map((value, i) => {
          return (
            <div key={`direction${i}`}>
              <label htmlFor={`direction${i}`}>{`${i + 1}`}</label>
              <input
                style={{ width: "80%" }}
                id={`direction${i}`}
                data-testid={`direction${i}`}
                type="text"
                value={recipeToUpdate.directions[i]}
                onChange={(e: any) => {
                  const copy = [...recipeToUpdate.directions];
                  copy[i] = e.target.value;
                  setRecipeToUpdate({ ...recipeToUpdate, directions: copy });
                }}
              />

              <button
                type="button"
                data-testid={`direction${i}ButtonUp`}
                onClick={() => locationChange("up", i, "directions")}
              >
                Move up
              </button>
              <button
                type="button"
                data-testid={`direction${i}ButtonDown`}
                onClick={() => locationChange("down", i, "directions")}
              >
                Move down
              </button>
            </div>
          );
        })}
        <button type="button" onClick={handleAddDirection}>
          + direction{" "}
        </button>
      </>
      <br></br>
      <section>
        <label>Category </label>
        <InputFieldRadio
          type="radio"
          label="Dinner"
          setNewRecipe={setRecipeToUpdate}
          newRecipe={recipeToUpdate}
          name="category"
          value={"Dinner"}
          required={false}
        />
        <InputFieldRadio
          type="radio"
          label="Cocktail"
          setNewRecipe={setRecipeToUpdate}
          newRecipe={recipeToUpdate}
          name="category"
          value={"Cocktail"}
          required={false}
        />
        <InputFieldRadio
          type="radio"
          label="Other"
          setNewRecipe={setRecipeToUpdate}
          newRecipe={recipeToUpdate}
          name="category"
          value={"Other"}
          required={false}
        />
      </section>
      <br></br>
      <section>
        <label>Region </label>
        <InputFieldRadio
          type="radio"
          label="North America"
          setNewRecipe={setRecipeToUpdate}
          newRecipe={recipeToUpdate}
          name="region"
          value={"North America"}
          required={false}
        />
        <InputFieldRadio
          type="radio"
          label="South America"
          setNewRecipe={setRecipeToUpdate}
          newRecipe={recipeToUpdate}
          name="region"
          value={"South America"}
          required={false}
        />
        <InputFieldRadio
          type="radio"
          label="Europe"
          setNewRecipe={setRecipeToUpdate}
          newRecipe={recipeToUpdate}
          name="region"
          value={"Europe"}
          required={false}
        />
        <InputFieldRadio
          type="radio"
          label="Asia"
          setNewRecipe={setRecipeToUpdate}
          newRecipe={recipeToUpdate}
          name="region"
          value={"Asia"}
          required={false}
        />
        <InputFieldRadio
          type="radio"
          label="Africa"
          setNewRecipe={setRecipeToUpdate}
          newRecipe={recipeToUpdate}
          name="region"
          value={"Africa"}
          required={false}
        />
      </section>
      <br></br>
      <CountryInput
        setNewRecipe={setRecipeToUpdate}
        newRecipe={recipeToUpdate}
      />
      Currently is:{" "}
      {recipeToUpdate.country.length > 1 ? recipeToUpdate.country : "Not set"}
      <br></br>
      <br></br>
      <InputField
        name="story"
        type="text"
        label="Story"
        setNewRecipe={setRecipeToUpdate}
        newRecipe={recipeToUpdate}
        value={recipeToUpdate.story}
        required={false}
      />
      <InputField
        name="drinkPairings"
        type="text"
        label="Drink Pairings"
        setNewRecipe={setRecipeToUpdate}
        newRecipe={recipeToUpdate}
        value={recipeToUpdate.drinkPairings}
        required={false}
      />
      <NotesTextArea
        newRecipe={recipeToUpdate}
        setNewRecipe={setRecipeToUpdate}
      />
      <section>
        <br></br> <button type="submit">Save</button>
      </section>
      <BackButton linkTo={undefined} />
    </form>
  );
};

export default UpdateRecipeForm;
