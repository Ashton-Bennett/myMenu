import BackButton from "../components/BackButton";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import menuService from "../services/menus";
import { Ingredient, Menu, Recipe, User, isHeading } from "../types";
import findIngredientShoppingLocationAndAddID from "../utils/ingredientShoppingLocation";
import userServices from "../services/user";

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
          if (isHeading(ingredient)) {
            return undefined;
          } else {
            return findIngredientShoppingLocationAndAddID(ingredient);
          }
        });
      });

      const sortedList = recipesOnMenu
        .flat()
        .filter((ingredient: Ingredient) => ingredient !== undefined)
        .sort();
      setList(sortedList);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleStrikeThrough = (id: string) => {
    const ingredientToCheck = list.filter((item) => item.id === id)[0];
    ingredientToCheck.checked = !ingredientToCheck.checked;
    const newList = list.filter((item) => item.id !== id);
    setList([...newList, ingredientToCheck]);
  };

  const handleAddToGroceryList = () => {
    const ingredientsThatAreNotCheckedOff = list.filter((ingredient) => {
      return (
        !ingredient.checked &&
        ingredient.name.toLowerCase() !== "water" &&
        ingredient !== undefined
      );
    });

    if (user && ingredientsThatAreNotCheckedOff) {
      setUser((prev: any) => {
        return {
          ...prev,
          userGroceryList: prev.userGroceryList.concat(
            ingredientsThatAreNotCheckedOff
          ),
        };
      });
      const updatedUser = {
        ...user,
        userGroceryList: user.userGroceryList.concat(
          ingredientsThatAreNotCheckedOff
        ),
      };
      userServices.updateUser(user.id, updatedUser);
    }
    navigate("/myGroceryList");
  };
  console.log();
  return (
    <>
      <h1>Shopping List for {menu?.name}:</h1>
      <ul>
        {list.length > 0 &&
          list.map((ingredient, i) => {
            return ingredient.name ? (
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
                  <button
                    onClick={() =>
                      ingredient.id && toggleStrikeThrough(ingredient.id)
                    }
                  >
                    check
                  </button>
                </span>
              </li>
            ) : null;
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
