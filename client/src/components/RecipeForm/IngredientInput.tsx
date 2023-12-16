import { ChangeEventHandler, SetStateAction, useEffect, useState } from "react";
import { Ingredient, Recipe } from "../../types";
import IngredientSearchInput from "./IngredientSearchInput";
import IngredientNameInput from "./IngredientNameInput";

interface ComponentProps {
  i: number;
  setNewRecipe: Function;
  newRecipe: Recipe;
  isUpdateInput?: boolean;
  value?: Ingredient;
}

const IngredientInput = ({
  i,
  setNewRecipe,
  newRecipe,
  isUpdateInput,
  value,
}: ComponentProps) => {
  const [ingredient, setIngredient] = useState<Ingredient>(
    value || isUpdateInput
      ? (value as Ingredient)
      : {
          name: "",
          alias: [],
          pairings: [],
          season: [],
          checked: false,
          amount: 0,
          unitOfMeasure: "",
          groceryStoreLocation: "unknown",
        }
  );

  const handleQuantityChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const newValue = parseFloat(event.target.value);

    const validValue = newValue < 0 ? 0 : newValue;

    setIngredient((prev) => ({
      ...prev,
      amount: validValue,
    }));
  };

  const handleUnitChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setIngredient({
      ...ingredient,
      unitOfMeasure: event.target.value as string,
    });
  };

  useEffect(() => {
    if (ingredient?.name?.length > 1) {
      const copy = [...newRecipe.ingredients];
      copy[i] = ingredient;
      setNewRecipe({ ...newRecipe, ingredients: copy });
    }
  }, [ingredient]);

  const handleDeleteIngredient = (i: number) => {
    const updatedIngredientsArray = newRecipe.ingredients.filter(
      (_, index) => index !== i
    );
    setNewRecipe((prev: Recipe) => ({
      ...prev,
      ingredients: updatedIngredientsArray,
    }));
  };

  return (
    <div style={value?.id ? undefined : { border: "2px solid red" }}>
      <IngredientNameInput
        i={i}
        ingredient={ingredient}
        setIngredient={setIngredient}
      />
      <label htmlFor={`ingredient${i} quantity`}>
        Quantity:
        <input
          type="number"
          step="0.1"
          value={ingredient.amount}
          onChange={handleQuantityChange}
          id={`ingredient${i} quantity`}
          data-testid={`ingredient${i} quantity`}
        />
      </label>
      <select value={ingredient.unitOfMeasure} onChange={handleUnitChange}>
        <option value="">Unit of measure</option>
        <option value="pinch(s)">pinch</option>
        <option value="teaspoon(s)">teaspoon</option>
        <option value="Tablespoon(s)">Tablespoon</option>
        <option value="Cup(s)">cup</option>
        <option value="pint(s)">pint</option>
        <option value="Liter(s)">Liter</option>
        <option value="milliliters">milliliters</option>
        <option value="quart(s)">quart</option>
        <option value="gallon(s)">gallon</option>
        <option value="oz(s)">oz</option>
        <option value="Pound(s)">Pound</option>
        <option value="g(s)">g</option>
        <option value="Kg(s)">Kg</option>
        <option value="to taste">to taste</option>
        <option value="each">each</option>
        <option value="to garnish">to garnish</option>
      </select>
      <button onClick={() => handleDeleteIngredient(i)} type="button">
        delete ingredient
      </button>
      <IngredientSearchInput
        ingredient={ingredient}
        setIngredient={setIngredient}
      />
    </div>
  );
};

export default IngredientInput;
