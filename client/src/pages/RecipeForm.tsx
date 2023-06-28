import { useState } from "react";
import { Recipe } from "../types";
import InputField from "../components/RecipeForm/InputField";
import InputFieldRadio from "../components/RecipeForm/InputFieldRadio";
import CountryInput from "../components/RecipeForm/CountryInput";
import recipeService from "../services/recipes";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";
import IngredientInput from "../components/RecipeForm/IngredientInput";

interface recipeFormProps {
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
}

const RecipeForm = ({ recipes, setRecipes }: recipeFormProps) => {
  const [newRecipe, setNewRecipe] = useState<Recipe>({
    id: null,
    name: "",
    servings: 0,
    ingredients: [""],
    prepTime: 0,
    directions: [""],
    category: "",
    region: "",
    country: "",
    story: "",
    drinkPairings: "",
  });

  const navigate = useNavigate();

  const handleAddIngredient = () => {
    setNewRecipe({ ...newRecipe, ingredients: [...newRecipe.ingredients, ""] });
  };

  const handleAddDirection = () => {
    setNewRecipe({ ...newRecipe, directions: [...newRecipe.directions, ""] });
  };

  const locationChange = (direction: string, key: number): undefined => {
    const directions = newRecipe.directions;
    const currentLocation = directions.indexOf(directions[key]);
    if (direction === "up" && currentLocation !== 0) {
      let inputs = [...directions];
      const newLocation = currentLocation - 1;
      const movingInput = inputs.splice(currentLocation, 1);
      inputs.splice(newLocation, 0, movingInput[0]);
      setNewRecipe({ ...newRecipe, directions: inputs });
      return;
    }
    if (direction === "down") {
      let inputs = [...directions];
      const newLocation = currentLocation + 1;
      const movingInput = inputs.splice(currentLocation, 1);
      inputs.splice(newLocation, 0, movingInput[0]);
      setNewRecipe({ ...newRecipe, directions: inputs });
      return;
    }
    return;
  };

  const addRecipe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await recipeService.addRecipe(newRecipe);

      const newRecipeList: Recipe[] | undefined = await recipeService.getAll();
      if (newRecipeList) {
        setRecipes(newRecipeList);
        setNewRecipe({
          id: null,
          name: "",
          servings: 0,
          ingredients: [""],
          prepTime: 0,
          directions: [""],
          category: "",
          region: "",
          country: "",
          story: "",
          drinkPairings: "",
        });
      }
      navigate(-1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={addRecipe}>
      <h2>Add Recipe </h2>
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
        {newRecipe.ingredients.map((value, i) => {
          return (
            <div key={`ingredient${i}`}>
              {/* <label htmlFor={`ingredient${i}`}>Ingredient {i + 1}</label>
              <input
                id={`ingredient${i}`}
                data-testid={`ingredient${i}`}
                type="text"
                value={newRecipe.ingredients[i]}
                onChange={(e: any) => {
                  const copy = [...newRecipe.ingredients];
                  copy[i] = e.target.value;
                  setNewRecipe({ ...newRecipe, ingredients: copy });
                }}
              /> */}
              <IngredientInput
                i={i}
                setNewRecipe={setNewRecipe}
                newRecipe={newRecipe}
              />
            </div>
          );
        })}

        <button type="button" onClick={handleAddIngredient}>
          + ingredient
        </button>
        <br></br>
      </>
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
                onClick={() => locationChange("up", i)}
              >
                Move up
              </button>
              <button
                type="button"
                data-testid={`direction${i}ButtonDown`}
                onClick={() => locationChange("down", i)}
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

      <section>
        <br></br> <button type="submit">Save</button>
      </section>
      <BackButton linkTo={undefined} />
    </form>
  );
};

export default RecipeForm;
