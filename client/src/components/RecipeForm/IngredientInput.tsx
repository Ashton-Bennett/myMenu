import { SetStateAction, useEffect, useState } from "react";
import { Recipe } from "../../types";

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
  const [ingredientName, setIngredientName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitOfMeasure, setUnitOfMeasure] = useState("");

  const handleIngredientChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setIngredientName(event.target.value);
  };

  const handleQuantityChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setQuantity(event.target.value);
  };

  const handleUnitChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setUnitOfMeasure(event.target.value);
  };

  useEffect(() => {
    if (ingredientName.length > 1) {
      const copy = [...newRecipe.ingredients];
      copy[i] = `${ingredientName} ${quantity} ${unitOfMeasure}`;
      setNewRecipe({ ...newRecipe, ingredients: copy });
    }
  }, [ingredientName, quantity, unitOfMeasure]);

  return (
    <>
      <label htmlFor={`ingredient${i} name`}>
        Ingredient:
        <input
          id={`ingredient${i} name`}
          data-testid={`ingredient${i} name`}
          type="text"
          value={ingredientName}
          onChange={handleIngredientChange}
        />
      </label>
      <label htmlFor={`ingredient${i} quantity`}>
        Quantity:
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          id={`ingredient${i} quantity`}
          data-testid={`ingredient${i} quantity`}
        />
      </label>
      <select value={unitOfMeasure} onChange={handleUnitChange}>
        <option value="">Unit of measure</option>
        <option value="pinch">pinch</option>
        <option value="teaspoon">teaspoon</option>
        <option value="Tablespoon">Tablespoon</option>
        <option value="cup">cup</option>
        <option value="pint">pint</option>
        <option value="liter">liter</option>
        <option value="Milliliters">Milliliters</option>
        <option value="quart">quart</option>
        <option value="gallon">gallon</option>
        <option value="oz">oz</option>
        <option value="g">g</option>
        <option value="to taste">to taste</option>
        <option value="Kg">Kg</option>
        <option value="each">each</option>
      </select>
      {isUpdateInput && <>Currently: {newRecipe.ingredients[i]}</>}
    </>
  );
};

export default IngredientInput;
