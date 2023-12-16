import { SetStateAction } from "react";
import { Ingredient } from "../../types";

interface componentProps {
  i: number;
  ingredient: Ingredient;
  setIngredient: Function;
}
const IngredientNameInput = ({
  i,
  ingredient,
  setIngredient,
}: componentProps) => {
  const handleIngredientChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setIngredient({ ...ingredient, name: event.target.value as string });
  };

  return (
    <>
      {" "}
      <label htmlFor={`ingredient${i} ${ingredient.name}`}>
        Ingredient:
        <input
          id={`ingredient${i} ${ingredient.name}`}
          data-testid={`ingredient${i} ${ingredient.name}`}
          type="text"
          value={ingredient.name}
          onChange={handleIngredientChange}
        />
      </label>
    </>
  );
};

export default IngredientNameInput;
