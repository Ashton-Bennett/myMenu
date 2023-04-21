import { useState } from "react";
import { Recipe } from "../../types";
import InputField from "./InputField";
import InputFieldRadio from "./InputFieldRadio";

interface recipeFormProps {
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
}

const RecipeForm = ({ recipes, setRecipes }: recipeFormProps) => {
  const [newRecipe, setNewRecipe] = useState<Recipe>({
    name: "",
    servings: 0,
    ingredients: [""],
    prepTime: 0,
    directions: [""],
    category: "",
    region: "",
    country: "",
    story: "",
  });

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

  const addRecipe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRecipes([...recipes, newRecipe]);
    setNewRecipe({
      name: "",
      servings: 0,
      ingredients: [""],
      prepTime: 0,
      directions: [""],
      category: "",
      region: "",
      country: "",
      story: "",
    });
    console.log("ADDED NEW RECIPE:", newRecipe.name);
    return;
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
      />
      <InputField
        name="servings"
        value={newRecipe.servings}
        type="number"
        label="Serves"
        setNewRecipe={setNewRecipe}
        newRecipe={newRecipe}
      />
      <section>
        <label>Ingredients/amount </label>
        {newRecipe.ingredients.map((value, i) => {
          return (
            <div key={`ingredient${i}`}>
              <input
                type="text"
                value={newRecipe.ingredients[i]}
                onChange={(e: any) => {
                  const copy = [...newRecipe.ingredients];
                  copy[i] = e.target.value;
                  setNewRecipe({ ...newRecipe, ingredients: copy });
                }}
              />
            </div>
          );
        })}

        <button type="button" onClick={handleAddIngredient}>
          + ingredient{" "}
        </button>
      </section>
      <InputField
        name="prepTime"
        value={newRecipe.prepTime}
        type="number"
        label="Prep time(mins)"
        setNewRecipe={setNewRecipe}
        newRecipe={newRecipe}
      />
      <section>
        <label>Directions </label>
        {newRecipe.directions.map((value, i) => {
          return (
            <div key={`direction${i}`}>
              <input
                type="text"
                value={newRecipe.directions[i]}
                onChange={(e: any) => {
                  const copy = [...newRecipe.directions];
                  copy[i] = e.target.value;
                  setNewRecipe({ ...newRecipe, directions: copy });
                }}
              />
              <button type="button" onClick={() => locationChange("up", i)}>
                Move up
              </button>
              <button type="button" onClick={() => locationChange("down", i)}>
                Move down
              </button>
            </div>
          );
        })}
        <button type="button" onClick={handleAddDirection}>
          + direction{" "}
        </button>
      </section>
      <br></br>
      <section>
        <label>Category </label>
        <InputFieldRadio
          type="radio"
          label="Dinner"
          setNewRecipe={setNewRecipe}
          newRecipe={newRecipe}
          name="category"
          value={newRecipe.category}
        />
        <InputFieldRadio
          type="radio"
          label="Cocktail"
          setNewRecipe={setNewRecipe}
          newRecipe={newRecipe}
          name="category"
          value={newRecipe.category}
        />
        <InputFieldRadio
          type="radio"
          label="Other"
          setNewRecipe={setNewRecipe}
          newRecipe={newRecipe}
          name="category"
          value={newRecipe.category}
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
          value={newRecipe.region}
        />
        <InputFieldRadio
          type="radio"
          label="Central America"
          setNewRecipe={setNewRecipe}
          newRecipe={newRecipe}
          name="region"
          value={newRecipe.region}
        />
        <InputFieldRadio
          type="radio"
          label="South America"
          setNewRecipe={setNewRecipe}
          newRecipe={newRecipe}
          name="region"
          value={newRecipe.region}
        />
        <InputFieldRadio
          type="radio"
          label="Europe"
          setNewRecipe={setNewRecipe}
          newRecipe={newRecipe}
          name="region"
          value={newRecipe.region}
        />
        <InputFieldRadio
          type="radio"
          label="Asia"
          setNewRecipe={setNewRecipe}
          newRecipe={newRecipe}
          name="region"
          value={newRecipe.region}
        />
        <InputFieldRadio
          type="radio"
          label="Africa"
          setNewRecipe={setNewRecipe}
          newRecipe={newRecipe}
          name="region"
          value={newRecipe.region}
        />
      </section>
      <br></br>
      <InputField
        name="country"
        type="text"
        label="Country"
        setNewRecipe={setNewRecipe}
        newRecipe={newRecipe}
        value={newRecipe.country}
      />
      <InputField
        name="story"
        type="text"
        label="Story"
        setNewRecipe={setNewRecipe}
        newRecipe={newRecipe}
        value={newRecipe.story}
      />
      <section>
        <br></br> <button type="submit">Save</button>
      </section>
    </form>
  );
};

export default RecipeForm;
