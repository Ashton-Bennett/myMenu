import { useState, useEffect } from "react";
import ingredientService from "../../services/ingredients";
import { Ingredient } from "../../types";

interface componentProps {
  ingredient: Ingredient;
  setIngredient: Function;
}

const IngredientSearchInput = ({
  ingredient,
  setIngredient,
}: componentProps) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>();
  const [ingredientsToDisplay, setIngredientsToDisplay] =
    useState<Ingredient[]>();
  const [clickedIngredient, setClickedIngredient] = useState(false);

  useEffect(() => {
    ingredientService.getAll().then((response) => {
      setIngredients(response);
    });
  }, []);

  useEffect(() => {
    if (ingredient.name) {
      const filteredIngredients = ingredients?.filter((ingredientsInDB) => {
        return ingredientsInDB.alias.some((alias) => {
          return alias.toLowerCase().includes(ingredient.name.toLowerCase());
        });
      });

      setIngredientsToDisplay(filteredIngredients);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingredient.name]);

  useEffect(() => {
    if (clickedIngredient) {
      setIngredientsToDisplay([]);
      setClickedIngredient(false);
    }
  }, [clickedIngredient]);

  const handleItemClick = (item: Ingredient, alias: string) => {
    setClickedIngredient(true);
    setIngredient((prev: Ingredient) => ({
      ...item,
      amount: prev.amount,
      unitOfMeasure: prev.unitOfMeasure,
      alias: [item.name],
      name: alias,
    }));
  };

  return (
    <>
      {ingredient.name && ingredientsToDisplay && (
        <ul>
          {ingredientsToDisplay?.map((item) =>
            item.alias.map((alias, i) => (
              <li
                key={`${alias} + ${i}`}
                onClick={() => handleItemClick(item, alias)}
              >
                {alias}
              </li>
            ))
          )}
        </ul>
      )}
    </>
  );
};

export default IngredientSearchInput;
