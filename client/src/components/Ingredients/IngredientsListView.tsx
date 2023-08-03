import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Ingredient } from "../../types";
import ingredientServices from "../../services/ingredients";
import BackButton from "../BackButton";

const IngredientsListView = () => {
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
      <BackButton linkTo={"/ingredients"} />
    </>
  );
};

export default IngredientsListView;
