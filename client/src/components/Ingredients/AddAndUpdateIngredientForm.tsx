import { useState } from "react";
import { Ingredient } from "../../types";
import SeasonInput from "./SeasonInput";
import ArrayOfTextInput from "./ArrayOfTextInput";
import ingredientService from "../../services/ingredients";
import { useNavigate } from "react-router-dom";
import IngredientStoreLocationInput from "./IngredientStoreLocationInput";
import NewIngredientNameInput from "./NewIngredientNameInput";
import BackButton from "../BackButton";

const initialIngredient = {
  name: "",
  alias: [""],
  season: [],
  pairings: [""],
  groceryListId: undefined,
  checked: false,
  amount: undefined,
  unitOfMeasure: undefined,
  groceryStoreLocation: undefined,
};

interface ComponentProps {
  componentType: "update" | "add";
  ingredientToUpdate?: Ingredient;
}

const AddIngredientForm = ({
  componentType,
  ingredientToUpdate,
}: ComponentProps) => {
  const [newIngredient, setNewIngredient] = useState<Ingredient>(
    ingredientToUpdate ? ingredientToUpdate : initialIngredient
  );

  const navigate = useNavigate();

  const handleSubmit = () => {
    ingredientService.addIngredient(newIngredient);
    setNewIngredient(initialIngredient);
    return;
  };

  const handleUpdateSubmit = () => {
    ingredientService.updateIngredient(newIngredient.id, newIngredient);
    navigate("/ingredients");
  };

  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setNewIngredient({
      ...newIngredient,
      [event.target.name]: event.target.value,
    });
  };
  return (
    <form
      onSubmit={componentType === "add" ? handleSubmit : handleUpdateSubmit}
    >
      <h2>{componentType === "add" ? "Add New Ingredient" : null}</h2>
      <NewIngredientNameInput
        handleInputChange={handleInputChange}
        newIngredient={newIngredient}
      />
      <br></br>
      <ArrayOfTextInput
        value="alias"
        newIngredient={newIngredient}
        setNewIngredient={setNewIngredient}
      />
      <br></br>
      <SeasonInput
        newIngredient={newIngredient}
        setNewIngredient={setNewIngredient}
      />
      <br></br>
      <ArrayOfTextInput
        value="pairings"
        newIngredient={newIngredient}
        setNewIngredient={setNewIngredient}
      />
      <br></br>
      <IngredientStoreLocationInput
        handleInputChange={handleInputChange}
        newIngredient={newIngredient}
      />
      <br></br>
      <br></br>
      <button type="submit">submit</button>
      <br></br>
      <br></br>
      <BackButton linkTo={undefined} />
    </form>
  );
};

export default AddIngredientForm;
