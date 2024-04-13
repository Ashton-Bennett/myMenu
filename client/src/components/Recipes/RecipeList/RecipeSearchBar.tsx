import { useEffect, useState } from "react";
import { Ingredient, Recipe } from "../../../types";
import CountryInputBasic from "./CountryInputBasic";

interface componentProps {
  setFilteredListOfRecipes: Function;
  recipes: Recipe[];
}

const RecipeSearchBar = ({
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

  const storedSearchInputValues = sessionStorage.getItem("sessionRecipeSearch");
  const storedShowAdvancedValue = sessionStorage.getItem(
    "showAdvancedRecipeSearchOptions"
  );

  const [searchInputs, setSearchInputs] = useState(
    storedSearchInputValues
      ? JSON.parse(storedSearchInputValues)
      : searchInputsObjectDefault
  );
  const [showAdvanced, setShowAdvanced] = useState(
    storedShowAdvancedValue ? JSON.parse(storedShowAdvancedValue) : false
  );

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
          return true;
        }

        return false;
      });
    }
    setFilteredListOfRecipes(filteredRecipes);
  };

  useEffect(() => {
    nameFilterHandler();
  }, [searchInputs]);

  useEffect(() => {
    nameFilterHandler();
    if (storedSearchInputValues) {
      setSearchInputs(JSON.parse(storedSearchInputValues));
    }
  }, []);

  const handleInputChange = (event: any) => {
    setSearchInputs((prev: object) => {
      const newState = {
        ...prev,
        [event.target.name]: event.target.value,
      };
      sessionStorage.setItem("sessionRecipeSearch", JSON.stringify(newState));
      return newState;
    });
  };

  const handleClearFilters = () => {
    setSearchInputs(searchInputsObjectDefault);
    sessionStorage.removeItem("sessionRecipeSearch");
  };

  const handleShowAdvanced = () => {
    setShowAdvanced((prev: boolean) => {
      const newValue = !prev;
      sessionStorage.setItem(
        "showAdvancedRecipeSearchOptions",
        String(newValue)
      );
      return newValue;
    });
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
      <button
        id="clearFiltersButton"
        type="button"
        onClick={handleClearFilters}
      >
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
