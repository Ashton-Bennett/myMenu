import { Ingredient, User } from "../../types";
import { sortByName } from "../../utils/sortByName";
import userService from "../../services/user";

interface ComponentProps {
  name: string;
  list: Ingredient[];
  user: User;
  setUser: Function;
  socket: Function;
}

const DisplayGroceryList = ({
  name,
  list,
  user,
  setUser,
  socket,
}: ComponentProps) => {
  const deleteIngredient = (Ingredient: Ingredient) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${Ingredient.name}?`
    );
    if (isConfirmed) {
      const updatedUser = {
        ...user,
        userGroceryList: user?.userGroceryList.filter(
          (ingredientInUserGroceryList) =>
            ingredientInUserGroceryList.groceryListId !==
            Ingredient.groceryListId
        ),
      };
      userService.updateUser(updatedUser.id, updatedUser);
      setUser(updatedUser);
      socket(updatedUser);
    }
  };

  const handleCheckOffIngredient = (event: any, ingredient: Ingredient) => {
    event.preventDefault();
    const updatedIngredient = { ...ingredient, checked: !ingredient.checked };
    const updatedList = user?.userGroceryList.map((listIngredient) => {
      if (listIngredient.groceryListId === ingredient.groceryListId) {
        return updatedIngredient;
      }
      return listIngredient;
    });
    setUser((prevUser: User) => ({
      ...prevUser,
      userGroceryList: updatedList,
    }));
    socket({ ...user, userGroceryList: updatedList });
  };

  // Will convert grams to kilos and ml to liters.
  list = list.map((ingredient) => {
    if (
      ingredient.unitOfMeasure &&
      ["milliliters", "g(s)"].includes(ingredient.unitOfMeasure) &&
      ingredient.amount &&
      Number(ingredient.amount) >= 1000
    ) {
      return {
        ...ingredient,
        amount: Number(ingredient.amount) / 1000,
        unitOfMeasure:
          ingredient.unitOfMeasure === "milliliters" ? "Liter(s)" : "Kg(s)",
      };
    } else {
      return ingredient;
    }
  });

  return (
    <>
      <br></br>
      <br></br>
      <h2>{name}:</h2>
      {list.sort(sortByName).map((ingredient, i) => {
        const ingredientDisplayName =
          ingredient?.alias?.length > 0 ? ingredient.alias : ingredient.name;
        return (
          <div key={ingredient.name + i}>
            <p
              style={{
                textDecoration: ingredient.checked ? "line-through" : "none",
              }}
            >
              {ingredientDisplayName}{" "}
              {(name === "Deli" ||
                name === "Meat Department" ||
                name === "Produce") &&
              ingredient.amount &&
              Number(ingredient.amount) > 16 &&
              ingredient.unitOfMeasure === "oz(s)" ? (
                <span>
                  {Math.round((Number(ingredient.amount) / 16) * 100) / 100}{" "}
                  Pound(s)
                </span>
              ) : (
                <span>
                  {ingredient.amount} {ingredient.unitOfMeasure}
                </span>
              )}
              <button
                value={`${ingredient.name}${i}`}
                onClick={() => ingredient && deleteIngredient(ingredient)}
              >
                Delete
              </button>
              &nbsp;&nbsp;&nbsp;
              <button onClick={(e) => handleCheckOffIngredient(e, ingredient)}>
                Check off
              </button>
            </p>{" "}
          </div>
        );
      })}
    </>
  );
};

export default DisplayGroceryList;
