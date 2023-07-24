import { useState, useEffect } from "react";
import { Ingredient } from "../../types";
import { useParams } from "react-router-dom";
import ingredientService from "../../services/ingredients";
import AddIngredientForm from "./AddAndUpdateIngredientForm";
import BackButton from "../BackButton";
const IngredientUpdateForm = () => {
  const [ingredient, setIngredient] = useState<Ingredient>();
  const { id } = useParams();

  useEffect(() => {
    ingredientService.getSingleIngredient(id).then((response) => {
      setIngredient(response);
    });
  }, []);

  return (
    <>
      <h1>Update Ingredient</h1>
      {ingredient?.name}
      {ingredient && (
        <AddIngredientForm
          componentType="update"
          ingredientToUpdate={ingredient}
        />
      )}
      <br></br>
      <br></br>
      <BackButton linkTo={undefined} />
    </>
  );
};

export default IngredientUpdateForm;
