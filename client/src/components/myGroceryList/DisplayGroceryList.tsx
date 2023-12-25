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
      `Are you sure you want to delete ${Ingredient.alias[0]}?`
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

  return (
    <>
      <br></br>
      <br></br>
      <h2>{name}:</h2>
      {list.sort(sortByName).map((ingredient, i) => {
        const ingredientDisplayName =
          ingredient?.alias?.length > 1 ? ingredient.alias : ingredient.name;
        return (
          <div key={ingredient.name + i}>
            <p
              style={{
                textDecoration: ingredient.checked ? "line-through" : "none",
              }}
            >
              {ingredientDisplayName} {ingredient.amount}{" "}
              {ingredient.unitOfMeasure}
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
