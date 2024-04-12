import { ChangeEventHandler } from "react";
import { Recipe } from "../../types";

interface componentProps {
  menuItem: Recipe;
  handleRecipeServingAmountChange: ChangeEventHandler<HTMLInputElement>;
}

const ServingsAmountInput = ({
  menuItem,
  handleRecipeServingAmountChange,
}: componentProps) => {
  const handleOutOfReachValues = (e: any) => {
    if (e.target.value <= 0) {
      e.target.value = 1;
    }
  };
  return (
    <>
      <label htmlFor="servingInput"> Servings:</label>
      <input
        onInput={handleOutOfReachValues}
        onChange={handleRecipeServingAmountChange}
        min={1}
        id="servingInput"
        type="number"
        defaultValue={menuItem.servings}
      />
    </>
  );
};

export default ServingsAmountInput;
