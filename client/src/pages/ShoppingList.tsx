import BackButton from "../components/BackButton";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import menuService from "../services/menus";
import { Ingredient, Menu, Recipe } from "../types";
import findIngredientShoppingLocation from "../utils/ingredientShoppingLocation";
import IngredientInput from "../components/RecipeForm/IngredientInput";

const ShoppingList = () => {
  const [menu, setMenu] = useState<Menu>();
  const { id } = useParams();
  const [list, setList] = useState<Ingredient[]>([]);

  useEffect(() => {
    menuService.getSingleMenu(id).then((response) => {
      setMenu(response);
      let recipesOnMenu = response.items;

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
  console.log(list);
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
      <BackButton linkTo={undefined} />
    </>
  );
};

export default ShoppingList;