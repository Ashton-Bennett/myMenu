import BackButton from "../components/BackButton";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import menuService from "../services/menus";
import { Ingredient, Menu, Recipe, User } from "../types";
import findIngredientShoppingLocation from "../utils/ingredientShoppingLocation";
import userServices from "../services/user";
import { v4 as uuidv4 } from "uuid";

interface componentProps {
  setUser: Function;
  user?: User;
}
const ShoppingList = ({ setUser, user }: componentProps) => {
  const [menu, setMenu] = useState<Menu>();
  const { id } = useParams();
  const [list, setList] = useState<Ingredient[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    menuService.getSingleMenu(id).then((response) => {
      setMenu(response);
      let recipesOnMenu = response.items.filter((item: Recipe) => {
        return item.checked !== true;
      });

      recipesOnMenu = recipesOnMenu.map((recipe: Recipe) => {
        return recipe.ingredients.map((ingredient) => {
          return findIngredientShoppingLocation(ingredient);
        });
      });

      const sortedList = recipesOnMenu.flat().sort();
      setList(sortedList);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleStrikeThrough = (name: string) => {
    const ingredientToCheck = list.filter((item) => item.name === name)[0];
    ingredientToCheck.checked = !ingredientToCheck.checked;
    const newList = list.filter((item) => item.name !== name);
    setList([...newList, ingredientToCheck]);
  };

  const handleAddToGroceryList = () => {
    const ingredientsThatAreNotCheckedOff = list.filter((ingredient) => {
      return !ingredient.checked;
    });

    const ingredientsToAdd = ingredientsThatAreNotCheckedOff.map(
      (ingredient) => {
        return { ...ingredient, id: uuidv4() };
      }
    );
    //add the ingredient id num to the ingredient objects.

    if (user && ingredientsToAdd) {
      setUser((prev: any) => {
        return {
          ...prev,
          userGroceryList: prev.userGroceryList.concat(ingredientsToAdd),
        };
      });
      const updatedUser = {
        ...user,
        userGroceryList: user.userGroceryList.concat(ingredientsToAdd),
      };
      userServices.updateUser(user.id, updatedUser);
    }
    navigate("/myGroceryList");
  };

  return (
    <>
      <h1>Shopping List for {menu?.name}:</h1>
      <ul>
        {list.length > 1 &&
          list.map((ingredient, i) => {
            return (
              <li
                key={ingredient.name + i}
                id={ingredient.name + i}
                style={{
                  textDecoration: ingredient.checked ? "line-through" : "none",
                }}
              >
                {ingredient.name} - {ingredient.amount}{" "}
                {ingredient.unitOfMeasure}
                <span>
                  <button onClick={() => toggleStrikeThrough(ingredient.name)}>
                    check
                  </button>
                </span>
              </li>
            );
          })}
      </ul>
      <br></br>
      <button onClick={handleAddToGroceryList}>
        Add unchecked items to grocery list
      </button>
      <br></br>
      <br></br>
      <BackButton linkTo={undefined} />
    </>
  );
};

export default ShoppingList;
