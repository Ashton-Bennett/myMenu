import { Ingredient, User } from "../../types";
import { sortByName } from "../../utils/sortByName";
import userService from "../../services/user";

interface ComponentProps {
  name: string;
  list: Ingredient[];
  user: User;
  setUser: Function;
}

const DisplayGroceryList = ({ name, list, user, setUser }: ComponentProps) => {
  const deleteIngredient = (Ingredient: Ingredient) => {
    const updatedUser = {
      ...user,
      userGroceryList: user?.userGroceryList.filter(
        (ingredientInUserGroceryList) =>
          ingredientInUserGroceryList.id !== Ingredient.id
      ),
    };
    userService.updateUser(updatedUser.id, updatedUser);
    setUser(updatedUser);
  };

  const handleCheckOffIngredient = (event: any, ingredient: Ingredient) => {
    event.preventDefault();
    const updatedIngredient = { ...ingredient, checked: !ingredient.checked };
    const updatedList = user?.userGroceryList.map((listIngredient) => {
      if (listIngredient.id === ingredient.id) {
        return updatedIngredient;
      }
      return listIngredient;
    });
    setUser((prevUser: User) => ({
      ...prevUser,
      userGroceryList: updatedList,
    }));
  };

  return (
    <>
      <br></br>
      <br></br>
      <h2>{name}:</h2>
      {list.sort(sortByName).map((ingredient, i) => {
        return (
          <div key={ingredient.name + i}>
            <p
              style={{
                textDecoration: ingredient.checked ? "line-through" : "none",
              }}
            >
              {ingredient.alias} {ingredient.amount} {ingredient.unitOfMeasure}
              <button
                value={`${ingredient.name}${i}`}
                onClick={() => ingredient && deleteIngredient(ingredient)}
              >
                Delete
              </button>
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
