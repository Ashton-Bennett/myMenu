import { useState, useEffect, Fragment } from "react";
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
  const [showVariation, setShowVariation] = useState<string>();

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

  const handleShowVariations = (event: any) => {
    event?.preventDefault();
    setShowVariation(event.target.value);
  };

  return (
    <>
      {ingredient.name && ingredientsToDisplay && (
        <ul>
          {ingredientsToDisplay?.map((item, i) => (
            <Fragment key={`${item} + ${i}`}>
              <li
                className="cursor"
                onClick={() => handleItemClick(item, item.name)}
              >
                {item.name} <span> </span>
              </li>
              <button
                value={item.name}
                onClick={handleShowVariations}
                type="button"
              >
                variations
              </button>
              {showVariation === item.name &&
                item.alias.map((alias, i) => (
                  <p
                    className="cursor"
                    key={`${alias} + ${i}`}
                    onClick={() => handleItemClick(item, alias)}
                  >
                    {alias}
                  </p>
                ))}
            </Fragment>
          ))}
        </ul>
      )}
    </>
  );
};

export default IngredientSearchInput;
