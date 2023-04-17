import { useEffect, useState } from "react";

const RecipeForm = () => {
  const [ingredientFields, setIngredientFields] = useState(1);
  const [directionFields, setDirectionFields] = useState(1);
  const [directionFieldsLocations, setDirectionFieldsLocations] = useState([
    "direction0",
  ]);

  useEffect(() => {
    for (let i = 1; i < directionFields; i++) {
      setDirectionFieldsLocations(
        directionFieldsLocations.concat(`direction${i}`)
      );
    }
  }, [directionFields]);

  const handleAddIngredient = () => {
    setIngredientFields(ingredientFields + 1);
  };

  const handleAddDirection = () => {
    setDirectionFields(directionFields + 1);
  };

  const locationChange = (direction: string, key: string) => {
    const currentLocation = directionFieldsLocations.indexOf(key);

    if (direction === "up" && currentLocation !== 0) {
      let inputs = [...directionFieldsLocations];
      const newLocation = currentLocation - 1;
      inputs.splice(currentLocation, 1);
      inputs.splice(newLocation, 0, key);
      return setDirectionFieldsLocations(inputs);
    }
    if (direction === "down") {
      let inputs = [...directionFieldsLocations];
      const newLocation = currentLocation + 1;
      inputs.splice(currentLocation, 1);
      inputs.splice(newLocation, 0, key);
      return setDirectionFieldsLocations(inputs);
    }
    return;
  };

  console.log("OUTSIDE:", directionFieldsLocations);
  return (
    <form>
      <h2>Add Recipe </h2>
      <section>
        <label>Name of recipe </label>
        <input type="text" />
      </section>
      <section>
        <label>Serves </label>
        <input type="number" />
      </section>
      <section>
        <label>Ingredients/amount </label>
        {Array.from({ length: ingredientFields }, (_, i) => (
          <div key={`ingredient${i}`}>
            <input type="text" />
          </div>
        ))}
        <button type="button" onClick={handleAddIngredient}>
          + ingredient{" "}
        </button>
      </section>
      <section>
        <label>Directions </label>
        {/* {Array.from({ length: directionFields }, (_, i) => (
          <div key={`direction${i}`}>
            <input type="text" />
            <button type="button">Move up</button>
            <button type="button">Move down</button>
          </div>
        ))} */}

        {directionFieldsLocations.map((i) => {
          return (
            <div key={`direction${i}`}>
              <input type="text" />
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
      <section>
        <label>Category </label>
        <input defaultChecked type="radio" name="category" />{" "}
        <label>Dinner</label>
        <input type="radio" name="category" /> <label>Cocktail</label>
        <input type="radio" name="category" /> <label>Other</label>
      </section>

      <section>
        <label>Region </label>
        <input defaultChecked type="radio" name="region" />{" "}
        <label>North American</label>
        <input type="radio" name="region" /> <label>Central American</label>
        <input type="radio" name="region" /> <label>South American</label>
        <input type="radio" name="region" /> <label>European</label>
        <input type="radio" name="region" /> <label>Asian</label>
        <input type="radio" name="region" /> <label>African</label>
      </section>
      <section>
        <label>Country</label>
        <input type="text" />
      </section>
      <section>
        <label>Story</label>
        <input type="text" />
      </section>
      <section>
        <br></br> <button type="submit">Save</button>
      </section>
    </form>
  );
};

export default RecipeForm;
