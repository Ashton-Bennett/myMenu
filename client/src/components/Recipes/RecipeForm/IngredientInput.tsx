import { ChangeEventHandler, SetStateAction, useEffect, useState } from "react";
import { Ingredient, Recipe, User } from "../../../types";
import IngredientSearchInput from "./IngredientSearchInput";
import IngredientNameInput from "./IngredientNameInput";
import { initialIngredient } from "../../Ingredients/Staples";

interface ComponentProps {
  i: number;
  setNewRecipe?: (value: SetStateAction<Recipe>) => void;
  setUser?: Function;
  newRecipe?: Recipe;
  isUpdateInput?: boolean;
  value?: Ingredient;
  ingredientQuickAdd?: Ingredient;
  setIngredientQuickAdd?: (value: SetStateAction<Ingredient>) => void;
  setErrorMessage?: (value: SetStateAction<string>) => void;
}

const IngredientInput = ({
  i,
  setNewRecipe,
  setUser,
  newRecipe,
  isUpdateInput,
  value,
  ingredientQuickAdd,
  setIngredientQuickAdd,
  setErrorMessage,
}: ComponentProps) => {
  const [ingredient, setIngredient] = useState<Ingredient>(
    value || isUpdateInput
      ? (value as Ingredient)
      : {
          name: "",
          alias: [],
          pairings: [],
          season: [],
          checked: false,
          amount: 0,
          unitOfMeasure: "",
          groceryStoreLocation: "unknown",
        }
  );

  const handleQuantityChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const newValue = parseFloat(event.target.value);

    const validValue = newValue < 0 ? 0 : newValue;
    if (setIngredientQuickAdd) {
      setIngredientQuickAdd((prev) => ({
        ...prev,
        amount: validValue,
      }));
      return;
    }
    setIngredient((prev) => ({
      ...prev,
      amount: validValue,
    }));
  };

  const handleUnitChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    if (setIngredientQuickAdd) {
      // @ts-ignore
      setIngredientQuickAdd({
        ...ingredientQuickAdd,
        unitOfMeasure: event.target.value as string,
      });
      return;
    }
    setIngredient({
      ...ingredient,
      unitOfMeasure: event.target.value as string,
    });
  };

  useEffect(() => {
    if (ingredient?.name?.length > 1 && setNewRecipe && newRecipe) {
      const copy = [...newRecipe.ingredients];
      copy[i] = ingredient;
      setNewRecipe({ ...newRecipe, ingredients: copy });
    }
  }, [ingredient]);

  const handleDeleteIngredient = (i: number) => {
    if (setIngredientQuickAdd) {
      setIngredientQuickAdd(initialIngredient);
    }
    if (setNewRecipe && newRecipe) {
      const updatedIngredientsArray = newRecipe.ingredients.filter(
        (_, index) => index !== i
      );
      setNewRecipe((prev: Recipe) => ({
        ...prev,
        ingredients: updatedIngredientsArray,
      }));
    }
  };

  const addStapleIngredient = () => {
    if (
      ingredientQuickAdd &&
      ingredientQuickAdd.id &&
      ingredientQuickAdd.id.length > 0
    ) {
      if (setUser && setIngredientQuickAdd) {
        setUser((prev: User) => ({
          ...prev,
          userStapleIngredients: {
            ...prev.userStapleIngredients,
            quickAddItems: [
              ...prev.userStapleIngredients.quickAddItems,
              ingredientQuickAdd,
            ],
          },
        }));

        setIngredientQuickAdd(initialIngredient);
      }
      if (setErrorMessage) setErrorMessage("");
    } else {
      if (setErrorMessage && ingredientQuickAdd) {
        setErrorMessage(
          `${ingredientQuickAdd.name} is not in the database and cannot be added to the quick-add list.`
        );
      }
    }
  };

  return (
    <div style={value?.id ? undefined : { border: "2px solid red" }}>
      <IngredientNameInput
        i={i}
        ingredient={ingredientQuickAdd ? ingredientQuickAdd : ingredient}
        setIngredient={
          setIngredientQuickAdd ? setIngredientQuickAdd : setIngredient
        }
      />
      <label htmlFor={`ingredient${i} quantity`}>
        Quantity:
        <input
          type="number"
          step="0.1"
          value={
            ingredientQuickAdd ? ingredientQuickAdd.amount : ingredient.amount
          }
          onChange={handleQuantityChange}
          id={`ingredient${i} quantity`}
          data-testid={`ingredient${i} quantity`}
        />
      </label>
      <select
        required={true}
        value={
          ingredientQuickAdd
            ? ingredientQuickAdd.unitOfMeasure
            : ingredient.unitOfMeasure
        }
        onChange={handleUnitChange}
      >
        <option value="">Unit of measure</option>
        <option value="pinch(s)">pinch</option>
        <option value="teaspoon(s)">teaspoon</option>
        <option value="Tablespoon(s)">Tablespoon</option>
        <option value="Cup(s)">cup</option>
        <option value="pint(s)">pint</option>
        <option value="Liter(s)">Liter</option>
        <option value="milliliters">milliliters</option>
        <option value="quart(s)">quart</option>
        <option value="gallon(s)">gallon</option>
        <option value="oz(s)">oz</option>
        <option value="Pound(s)">Pound</option>
        <option value="g(s)">g</option>
        <option value="Kg(s)">Kg</option>
        <option value="to taste">to taste</option>
        <option value="each">each</option>
        <option value="to garnish">to garnish</option>
      </select>
      <button onClick={() => handleDeleteIngredient(i)} type="button">
        {setUser ? "Clear" : "Delete Ingredient"}
      </button>
      {setUser && (
        <button onClick={addStapleIngredient} type="button">
          Add
        </button>
      )}
      <IngredientSearchInput
        ingredient={ingredientQuickAdd ? ingredientQuickAdd : ingredient}
        setIngredient={
          setIngredientQuickAdd ? setIngredientQuickAdd : setIngredient
        }
      />
    </div>
  );
};

export default IngredientInput;
