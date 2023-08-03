import { ChangeEventHandler } from "react";
import { Ingredient } from "../../types";

interface ComponentProps {
  newIngredient: Ingredient;
  handleInputChange: ChangeEventHandler<HTMLSelectElement>;
}

const IngredientStoreLocationInput = ({
  newIngredient,
  handleInputChange,
}: ComponentProps) => {
  return (
    <>
      <h3>Where is it located at a grocery store:</h3>
      <label htmlFor="dropdown">Select option:</label>
      <select
        id="dropdown"
        value={newIngredient.groceryStoreLocation}
        onChange={handleInputChange}
        name="groceryStoreLocation"
      >
        <option value={"unknown"}></option>
        <option value={"deli"}>deli</option>
        <option value={"produce"}>produce</option>
        <option value={"middle aisles"}>middle aisles</option>
        <option value={"meat department"}>meat department</option>
        <option value={"frozen"}>frozen</option>
        <option value={"dairy"}>dairy</option>
        <option value={"other"}>other</option>
      </select>
    </>
  );
};

export default IngredientStoreLocationInput;
