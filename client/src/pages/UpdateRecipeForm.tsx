import { useEffect, useState } from "react";
import { Recipe } from "../types";
import InputField from "../components/RecipeForm/InputField";
import InputFieldRadio from "../components/RecipeForm/InputFieldRadio";
import CountryInput from "../components/RecipeForm/CountryInput";
import recipeService from "../services/recipes";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import IngredientInput from "../components/RecipeForm/IngredientInput";

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
        const recipe: Recipe = response.data;
        setRecipeToUpdate(recipe);
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
    setRecipeToUpdate({
      ...recipeToUpdate,
      ingredients: [...recipeToUpdate.ingredients, ""],
    });
  };

  const handleAddDirection = () => {
    setRecipeToUpdate({
      ...recipeToUpdate,
      directions: [...recipeToUpdate.directions, ""],
    });
  };

  const locationChange = (direction: string, key: number): undefined => {
    const directions = recipeToUpdate.directions;
    const currentLocation = directions.indexOf(directions[key]);
    if (direction === "up" && currentLocation !== 0) {
      let inputs = [...directions];
      const newLocation = currentLocation - 1;
      const movingInput = inputs.splice(currentLocation, 1);
      inputs.splice(newLocation, 0, movingInput[0]);
      setRecipeToUpdate({ ...recipeToUpdate, directions: inputs });
      return;
    }
    if (direction === "down") {
      let inputs = [...directions];
      const newLocation = currentLocation + 1;
      const movingInput = inputs.splice(currentLocation, 1);
      inputs.splice(newLocation, 0, movingInput[0]);
      setRecipeToUpdate({ ...recipeToUpdate, directions: inputs });
      return;
    }
    return;
  };

  const addRecipe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    recipeService.updateRecipe(id, recipeToUpdate);
    console.log(recipes, id);
    // eslint-disable-next-line eqeqeq
    const newRecipeList = recipes.filter((recipe) => recipe.id != id);
    console.log(newRecipeList, "HERE");
    setRecipes([...newRecipeList, recipeToUpdate]);
    navigate(-1);
    return;
  };

  return (
    <form onSubmit={addRecipe}>
      <h2>Add Recipe </h2>
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
            <div key={`ingredient${i}`}>
              {/* <label htmlFor={`ingredient${i}`}>Ingredient {i + 1}</label>
              <input
                id={`ingredient${i}`}
                data-testid={`ingredient${i}`}
                type="text"
                value={recipeToUpdate.ingredients[i]}
                onChange={(e: any) => {
                  const copy = [...recipeToUpdate.ingredients];
                  copy[i] = e.target.value;
                  setRecipeToUpdate({ ...recipeToUpdate, ingredients: copy });
                }}
              /> */}
              <IngredientInput
                i={i}
                newRecipe={recipeToUpdate}
                setNewRecipe={setRecipeToUpdate}
                isUpdateInput={true}
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
          label="Central America"
          setNewRecipe={setRecipeToUpdate}
          newRecipe={recipeToUpdate}
          name="region"
          value={"Central America"}
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
        value={recipeToUpdate.country}
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
      <section>
        <br></br> <button type="submit">Save</button>
      </section>
      <BackButton linkTo={undefined} />
    </form>
  );
};

export default UpdateRecipeForm;
