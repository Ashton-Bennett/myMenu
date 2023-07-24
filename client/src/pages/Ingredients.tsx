import { useState, useEffect } from "react";
import BackButton from "../components/BackButton";
import ingredientServices from "../services/ingredients";
import { Ingredient } from "../types";
import AddIngredientForm from "../components/ingredientDatabaseView/AddAndUpdateIngredientForm";
import { Link } from "react-router-dom";

const Ingredients = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    ingredientServices.getAll().then((response) => {
      if (response) {
        setIngredients(response);
      }
    });
  }, []);

  const handleDeleteIngredient = async (ingredient: Ingredient) => {
    if (!ingredient.id) {
      console.warn(`Ingredient ${ingredient.name} has no ID, cannot delete.`);
      return;
    }

    try {
      await ingredientServices.deleteIngredient(ingredient.id);
      setIngredients((prevIngredients) =>
        prevIngredients.filter((item) => item.id !== ingredient.id)
      );
      console.log(`${ingredient.name} deleted successfully.`);
    } catch (error) {
      console.error(`Failed to delete ${ingredient.name}:`, error);
    }
  };

  const handleUpdateIngredient = (ingredient: Ingredient) => {
    return console.log("Update", ingredient);
  };

  return (
    <>
      <h1>Ingredients:</h1>
      {ingredients &&
        ingredients.map((ingredient, i) => {
          return (
            <p key={`${ingredient.name} + ${i}`}>
              {ingredient.name}{" "}
              <button onClick={() => handleDeleteIngredient(ingredient)}>
                delete
              </button>
              <Link to={`/ingredients/update/${ingredient.id}`}>
                <button>update</button>
              </Link>
            </p>
          );
        })}

      <AddIngredientForm componentType="add" />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <BackButton linkTo={"/"} />
    </>
  );
};

export default Ingredients;
