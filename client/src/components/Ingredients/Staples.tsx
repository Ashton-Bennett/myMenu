import { Link } from "react-router-dom";
import BackButton from "../BackButton";
import { useState } from "react";
import IngredientNameInput from "../RecipeForm/IngredientNameInput";
import IngredientSearchInput from "../RecipeForm/IngredientSearchInput";
import { Ingredient, User } from "../../types";
import IngredientInput from "../RecipeForm/IngredientInput";

export const initialIngredient: Ingredient = {
  name: "",
  alias: [],
  pairings: [],
  checked: false,
  amount: 0,
  season: [],
  groceryListId: "",
  unitOfMeasure: "",
  groceryStoreLocation: "unknown",
};

interface componentProps {
  user?: User;
  setUser?: Function;
}

const Staples = ({ user, setUser }: componentProps) => {
  const [ingredientNotToAddToGroceryList, setIngredientNotToAddToGroceryList] =
    useState<Ingredient>(initialIngredient);

  const [ingredientQuickAddToGroceryList, setIngredientQuickAddToGroceryList] =
    useState<Ingredient>(initialIngredient);

  const [errorMessage, setErrorMessage] = useState("");

  const handleIngredientAdd = () => {
    if (ingredientNotToAddToGroceryList.name.length > 0) {
      if (!ingredientNotToAddToGroceryList.id) {
        setErrorMessage(
          `${ingredientNotToAddToGroceryList.name} is not in the data base and cannot be added to the staple list.`
        );
        return;
      }
      if (setUser) {
        setUser((prev: User) => ({
          ...prev,
          userStapleIngredients: {
            ...prev.userStapleIngredients,
            itemsToNeverAdd: [
              ...prev.userStapleIngredients.itemsToNeverAdd,
              ingredientNotToAddToGroceryList,
            ],
          },
        }));
      }
    }
    setIngredientNotToAddToGroceryList(initialIngredient);
  };

  const handleDeleteIngredientsNotToAddToGroceryListArray = (
    ingredientToDelete: Ingredient,
    listType: string
  ) => {
    return () => {
      if (setUser) {
        if (listType === "notToAddList") {
          setUser((prev: User) => {
            let found = false;
            const updatedArray =
              prev.userStapleIngredients.itemsToNeverAdd.filter(
                (ingredient) => {
                  if (!found && ingredient === ingredientToDelete) {
                    found = true;
                    return false;
                  }
                  return true;
                }
              );

            return {
              ...prev,
              userStapleIngredients: {
                ...prev.userStapleIngredients,
                itemsToNeverAdd: updatedArray,
              },
            };
          });
        } else {
          setUser((prev: User) => {
            let found = false;
            const updatedArray =
              prev.userStapleIngredients.quickAddItems.filter((ingredient) => {
                if (!found && ingredient === ingredientToDelete) {
                  found = true;
                  return false;
                }
                return true;
              });
            return {
              ...prev,
              userStapleIngredients: {
                ...prev.userStapleIngredients,
                quickAddItems: updatedArray,
              },
            };
          });
        }
      }
    };
  };

  const handleToggleCheck = (index: number) => {
    if (setUser && user) {
      let ingredientToChange = user.userStapleIngredients.quickAddItems[index];
      const newValue = !user.userStapleIngredients.quickAddItems[index].checked;

      ingredientToChange = { ...ingredientToChange, checked: newValue };

      const newArray = [...user.userStapleIngredients.quickAddItems];
      newArray.splice(index, 1, ingredientToChange);

      setUser((prev: User) => ({
        ...prev,
        userStapleIngredients: {
          ...prev.userStapleIngredients,
          quickAddItems: newArray,
        },
      }));
    }
  };

  return (
    <>
      <div>
        <h1>Staple Ingredients:</h1>
        <p>Items that won't be added to my grocery list:</p>
        {errorMessage.includes("staple") && (
          <p style={{ color: "red" }}>{errorMessage}</p>
        )}
        <IngredientNameInput
          i={1}
          ingredient={ingredientNotToAddToGroceryList}
          setIngredient={setIngredientNotToAddToGroceryList}
        />
        <button onClick={handleIngredientAdd}>Add</button>
        <IngredientSearchInput
          ingredient={ingredientNotToAddToGroceryList}
          setIngredient={setIngredientNotToAddToGroceryList}
        />
        {user &&
          user.userStapleIngredients.itemsToNeverAdd.length > 0 &&
          user.userStapleIngredients.itemsToNeverAdd.map(
            (ingredient, index) => {
              return (
                <p key={`${ingredient?.name} + ${index}`}>
                  {ingredient?.name}
                  <button
                    style={{ marginLeft: "4px" }}
                    type="button"
                    onClick={handleDeleteIngredientsNotToAddToGroceryListArray(
                      ingredient,
                      "notToAddList"
                    )}
                  >
                    Remove
                  </button>
                </p>
              );
            }
          )}
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div>
        <p>Items that can be quickly added grocery list:</p>
        {errorMessage.includes("quick-add") && (
          <p style={{ color: "red" }}>{errorMessage}</p>
        )}
        {user &&
          user.userStapleIngredients.quickAddItems.length > 0 &&
          user.userStapleIngredients.quickAddItems.map((ingredient, index) => {
            return (
              <p key={`${ingredient.name} + ${index} + quickAdd`}>
                <span
                  style={
                    ingredient.checked ? { textDecoration: "line-through" } : {}
                  }
                >
                  {ingredient.name} {ingredient.amount}{" "}
                  {ingredient.unitOfMeasure}{" "}
                </span>
                <button
                  style={{ marginLeft: "4px" }}
                  type="button"
                  onClick={handleDeleteIngredientsNotToAddToGroceryListArray(
                    ingredient,
                    "quicklyAddToList"
                  )}
                >
                  Remove
                </button>
                <button
                  style={{ marginLeft: "4px" }}
                  type="button"
                  onClick={() => handleToggleCheck(index)}
                >
                  Strike through
                </button>
              </p>
            );
          })}

        <IngredientInput
          i={1}
          setUser={setUser}
          value={ingredientQuickAddToGroceryList}
          ingredientQuickAdd={ingredientQuickAddToGroceryList}
          setIngredientQuickAdd={setIngredientQuickAddToGroceryList}
          setErrorMessage={setErrorMessage}
        />
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <Link to="/myGroceryList">
        <button type="button">My Grocery List</button>
      </Link>
      {"  "}
      <BackButton linkTo={"/"} />
    </>
  );
};
export default Staples;
