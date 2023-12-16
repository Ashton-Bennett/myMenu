import { useState } from "react";
import { Ingredient, Recipe } from "../types";
import InputField from "../components/RecipeForm/InputField";
import InputFieldRadio from "../components/RecipeForm/InputFieldRadio";
import CountryInput from "../components/RecipeForm/CountryInput";
import recipeService from "../services/recipes";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";
import IngredientInput from "../components/RecipeForm/IngredientInput";
import NotesTextArea from "../components/RecipeForm/NotesTextArea";
import { v4 as uuidv4 } from "uuid";
import { isHeading } from "../types";
import HeadingInput from "../components/RecipeForm/HeadingInput";
import UserUploadFileInput from "./UserUploadFileInput";

interface recipeFormProps {
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
}

const RecipeForm = ({ recipes, setRecipes }: recipeFormProps) => {
  const [newRecipe, setNewRecipe] = useState<Recipe>({
    id: undefined,
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
  });

  const navigate = useNavigate();

  const handleAddIngredient = (type: string) => {
    setNewRecipe({
      ...newRecipe,
      ingredients: [
        ...newRecipe.ingredients,
        type === "ingredient"
          ? {
              name: "",
              alias: [""],
              season: [],
              pairings: [""],
              groceryListId: undefined,
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
    setNewRecipe({ ...newRecipe, directions: [...newRecipe.directions, ""] });
  };

  const locationChange = (
    direction: "up" | "down",
    key: number,
    arrayToChange: "directions" | "ingredients"
  ): void => {
    setNewRecipe((prev) => {
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

  const addRecipe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let doesntHaveBadIngredient = newRecipe.ingredients.every(
      (ingredient) => "id" in ingredient && ingredient.id !== null
    );
    const addRecipeInnerFunc = async () => {
      try {
        const updatedIngredientsToNumberType = newRecipe.ingredients.map(
          (ingredientOrHeading) => {
            if ("amount" in ingredientOrHeading) {
              const ingredient = ingredientOrHeading as Ingredient;
              return { ...ingredient, amount: Number(ingredient.amount) };
            } else {
              return ingredientOrHeading;
            }
          }
        );
        const updatedNewRecipeIngredientAmountToNumber = {
          ...newRecipe,
          ingredients: updatedIngredientsToNumberType,
        };
        await recipeService.addRecipe(updatedNewRecipeIngredientAmountToNumber);

        const newRecipeList: Recipe[] | undefined =
          await recipeService.getAll();
        if (newRecipeList) {
          setRecipes(newRecipeList);
          setNewRecipe({
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
          });
        }
        navigate(-1);
      } catch (error) {
        console.error(error);
      }
    };
    if (!doesntHaveBadIngredient) {
      if (
        window.confirm(
          `Are you sure you would like to Add this recipe? Ingredients marked red are not in the Database!`
        )
      ) {
        addRecipeInnerFunc();
      }
    } else addRecipeInnerFunc();
  };

  return (
    <form onSubmit={addRecipe}>
      <h2>Add Recipe </h2>

      <UserUploadFileInput setNewRecipe={setNewRecipe} />
      <br></br>
      <InputField
        name="name"
        value={newRecipe.name}
        type="text"
        label="Name of recipe"
        setNewRecipe={setNewRecipe}
        newRecipe={newRecipe}
        required={true}
      />
      <InputField
        name="servings"
        value={newRecipe.servings}
        type="number"
        label="Serves"
        setNewRecipe={setNewRecipe}
        newRecipe={newRecipe}
        required={false}
      />
      <>
        <label>Ingredients/amount </label>
        <br></br>
        {newRecipe.ingredients.map((value, i) => {
          return (
            <div style={{ display: "flex" }} key={`${value.id} + ${i}`}>
              {isHeading(value) ? (
                <HeadingInput
                  i={i}
                  setNewRecipe={setNewRecipe}
                  newRecipe={newRecipe}
                  value={value}
                />
              ) : (
                <IngredientInput
                  i={i}
                  setNewRecipe={setNewRecipe}
                  newRecipe={newRecipe}
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
        value={newRecipe.cookTime}
        type="number"
        label="Cook time(mins)"
        setNewRecipe={setNewRecipe}
        newRecipe={newRecipe}
        required={false}
      />
      <InputField
        name="prepTime"
        value={newRecipe.prepTime}
        type="number"
        label="Prep time(mins)"
        setNewRecipe={setNewRecipe}
        newRecipe={newRecipe}
        required={false}
      />
      <>
        <label>Directions </label>
        {newRecipe.directions.map((value, i) => {
          return (
            <div key={`direction${i}`}>
              <label htmlFor={`direction${i}`}>{`${i + 1}`}</label>
              <input
                style={{ width: "80%" }}
                id={`direction${i}`}
                data-testid={`direction${i}`}
                type="text"
                value={newRecipe.directions[i]}
                onChange={(e: any) => {
                  const copy = [...newRecipe.directions];
                  copy[i] = e.target.value;
                  setNewRecipe({ ...newRecipe, directions: copy });
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
          setNewRecipe={setNewRecipe}
          newRecipe={newRecipe}
          name="category"
          value={"Dinner"}
          required={false}
        />
        <InputFieldRadio
          type="radio"
          label="Cocktail"
          setNewRecipe={setNewRecipe}
          newRecipe={newRecipe}
          name="category"
          value={"Cocktail"}
          required={false}
        />
        <InputFieldRadio
          type="radio"
          label="Other"
          setNewRecipe={setNewRecipe}
          newRecipe={newRecipe}
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
          setNewRecipe={setNewRecipe}
          newRecipe={newRecipe}
          name="region"
          value={"North America"}
          required={false}
        />
        <InputFieldRadio
          type="radio"
          label="Central America"
          setNewRecipe={setNewRecipe}
          newRecipe={newRecipe}
          name="region"
          value={"Central America"}
          required={false}
        />
        <InputFieldRadio
          type="radio"
          label="South America"
          setNewRecipe={setNewRecipe}
          newRecipe={newRecipe}
          name="region"
          value={"South America"}
          required={false}
        />
        <InputFieldRadio
          type="radio"
          label="Europe"
          setNewRecipe={setNewRecipe}
          newRecipe={newRecipe}
          name="region"
          value={"Europe"}
          required={false}
        />
        <InputFieldRadio
          type="radio"
          label="Asia"
          setNewRecipe={setNewRecipe}
          newRecipe={newRecipe}
          name="region"
          value={"Asia"}
          required={false}
        />
        <InputFieldRadio
          type="radio"
          label="Africa"
          setNewRecipe={setNewRecipe}
          newRecipe={newRecipe}
          name="region"
          value={"Africa"}
          required={false}
        />
      </section>
      <br></br>
      <CountryInput
        setNewRecipe={setNewRecipe}
        newRecipe={newRecipe}
        value={newRecipe.country}
      />
      <br></br>
      <br></br>
      <InputField
        name="story"
        type="text"
        label="Story"
        setNewRecipe={setNewRecipe}
        newRecipe={newRecipe}
        value={newRecipe.story}
        required={false}
      />
      <InputField
        name="drinkPairings"
        type="text"
        label="Drink Pairings"
        setNewRecipe={setNewRecipe}
        newRecipe={newRecipe}
        value={newRecipe.drinkPairings}
        required={false}
      />
      <NotesTextArea newRecipe={newRecipe} setNewRecipe={setNewRecipe} />
      <section>
        <br></br> <button type="submit">Save</button>
      </section>
      <BackButton linkTo={undefined} />
    </form>
  );
};

export default RecipeForm;
