import { ChangeEventHandler, SetStateAction, useEffect, useState } from "react";
import { Ingredient, Recipe } from "../../types";

interface ComponentProps {
  i: number;
  setNewRecipe: Function;
  newRecipe: Recipe;
  isUpdateInput?: boolean;
}

const IngredientInput = ({
  i,
  setNewRecipe,
  newRecipe,
  isUpdateInput,
}: ComponentProps) => {
  const [ingredient, setIngredient] = useState<Ingredient>({
    name: "",
    alias: [],
    pairings: [],
    season: [],
    checked: false,
    amount: 0,
    unitOfMeasure: "",
    groceryStoreLocation: "unknown",
  });

  const handleIngredientChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setIngredient({ ...ingredient, name: event.target.value as string });
  };

  const handleQuantityChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setIngredient({
      ...ingredient,
      amount: event.target.value,
    });
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
    if (ingredient.name.length > 1) {
      const copy = [...newRecipe.ingredients];
      copy[i] = ingredient;
      setNewRecipe({ ...newRecipe, ingredients: copy });
    }
  }, [ingredient]);

  return (
    <>
      <label htmlFor={`ingredient${i} name`}>
        Ingredient:
        <input
          id={`ingredient${i} name`}
          data-testid={`ingredient${i} name`}
          type="text"
          value={ingredient.name}
          onChange={handleIngredientChange}
        />
      </label>
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
      </select>
      {isUpdateInput && (
        <>
          Currently: {newRecipe.ingredients[i].name} -{" "}
          {newRecipe.ingredients[i].amount}{" "}
          {newRecipe.ingredients[i].unitOfMeasure}
        </>
      )}
    </>
  );
};

export default IngredientInput;
