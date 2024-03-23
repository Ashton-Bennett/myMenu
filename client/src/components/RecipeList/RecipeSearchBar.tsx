import { useEffect, useState } from "react";
import { Ingredient, Recipe } from "../../types";
import CountryInputBasic from "../RecipeList/CountryInputBasic";

interface componentProps {
  filteredListOfRecipes: Recipe[];
  setFilteredListOfRecipes: Function;
  recipes: Recipe[];
}

const RecipeSearchBar = ({
  filteredListOfRecipes,
  setFilteredListOfRecipes,
  recipes,
}: componentProps) => {
  const searchInputsObjectDefault = {
    recipeNameInput: "",
    ingredientInput: "",
    minsToPrepareInput: "",
    countryInput: "",
    regionInput: "",
  };

  const [searchInputs, setSearchInputs] = useState(searchInputsObjectDefault);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const nameFilterHandler = () => {
      let filteredRecipes = recipes;
      //For Recipe Name input
      filteredRecipes = filteredRecipes.filter((recipe) =>
        recipe.name
          .toLowerCase()
          .includes(searchInputs.recipeNameInput.toLowerCase())
      );
      //For Ingredient input
      filteredRecipes = filteredRecipes.filter((recipe) => {
        return recipe.ingredients.some((ingredientOrHeading) => {
          if (ingredientOrHeading.hasOwnProperty("name")) {
            const ingredient = ingredientOrHeading as Ingredient;
            if (
              ingredient.name
                .toLowerCase()
                .includes(searchInputs.ingredientInput.toLowerCase())
            ) {
              return true;
            }
          }
          return false;
        });
      });
      // Region
      filteredRecipes = filteredRecipes.filter((recipe) => {
        if (
          searchInputs.regionInput === "" ||
          recipe.region === searchInputs.regionInput
        ) {
          return true;
        }
        return false;
      });

      if (showAdvanced) {
        // Mins to prepare input
        filteredRecipes = filteredRecipes.filter((recipe) => {
          if (searchInputs.minsToPrepareInput === "") {
            return true;
          }

          const recipeCookTime = recipe.cookTime ? recipe.cookTime : 0;
          const recipePrepTime = recipe.prepTime ? recipe.prepTime : 0;
          const totalTime = Number(recipeCookTime) + Number(recipePrepTime);

          if (totalTime <= Number(searchInputs.minsToPrepareInput)) {
            return true;
          }
          return false;
        });

        filteredRecipes = filteredRecipes.filter((recipe) => {
          if (searchInputs.countryInput === "") {
            return true;
          }

          if (
            searchInputs.countryInput
              .toLowerCase()
              .includes(recipe.country.toLowerCase()) &&
            recipe.country.length > 2
          ) {
            console.log(
              recipe.name,
              searchInputs.countryInput.toLowerCase(),
              recipe.country.toLowerCase()
            );
            return true;
          }

          return false;
        });
      }

      setFilteredListOfRecipes(filteredRecipes);
    };

    nameFilterHandler();
  }, [searchInputs]);

  const handleInputChange = (event: any) => {
    setSearchInputs({
      ...searchInputs,
      [event.target.name]: event.target.value,
    });
  };

  const handleClearFilters = () => {
    setSearchInputs(searchInputsObjectDefault);
  };

  const handleShowAdvanced = () => {
    setShowAdvanced((prev) => !prev);
  };

  return (
    <div>
      <b>Search</b>{" "}
      <input
        type="text"
        placeholder={"Recipe name..."}
        name="recipeNameInput"
        value={searchInputs.recipeNameInput}
        onChange={handleInputChange}
      ></input>{" "}
      <input
        type="text"
        name="ingredientInput"
        placeholder={"Ingredient..."}
        value={searchInputs.ingredientInput}
        onChange={handleInputChange}
      ></input>{" "}
      <select
        id="selectOptions"
        name="regionInput"
        onChange={handleInputChange}
        value={searchInputs.regionInput}
      >
        <option value="">Region...</option>
        <option value="North America">North America</option>
        <option value="South America">South America</option>
        <option value="Europe">Europe</option>
        <option value="Asia">Asia</option>
        <option value="Africa">Africa</option>
      </select>{" "}
      <button type="button" onClick={handleClearFilters}>
        Clear filters
      </button>{" "}
      <span
        style={{ color: "blue", cursor: "pointer" }}
        onClick={handleShowAdvanced}
      >
        <i>Advanced</i>
      </span>
      {showAdvanced && (
        <div>
          <br></br>
          <input
            type="number"
            step={15}
            name="minsToPrepareInput"
            placeholder="Mins to prepare..."
            value={searchInputs.minsToPrepareInput}
            onChange={handleInputChange}
          ></input>{" "}
          <CountryInputBasic
            name="countryInput"
            placeholder={"Country..."}
            changeHandler={handleInputChange}
            setInputValue={setSearchInputs}
            inputValue={searchInputs.countryInput}
          />
        </div>
      )}
    </div>
  );
};

export default RecipeSearchBar;
