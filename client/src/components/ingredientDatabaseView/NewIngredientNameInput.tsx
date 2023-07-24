import { Ingredient } from "../../types";
import { ChangeEventHandler } from "react";

interface ComponentProps {
  newIngredient: Ingredient;
  handleInputChange: ChangeEventHandler<HTMLInputElement>;
}
const NewIngredientNameInput = ({
  newIngredient,
  handleInputChange,
}: ComponentProps) => {
  return (
    <>
      <label htmlFor="name">Name:</label>
      <input
        id="name"
        type={"text"}
        value={newIngredient.name}
        name="name"
        onChange={handleInputChange}
        required
      />
    </>
  );
};

export default NewIngredientNameInput;
