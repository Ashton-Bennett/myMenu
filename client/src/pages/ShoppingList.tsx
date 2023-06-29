import BackButton from "../components/BackButton";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import menuService from "../services/menus";
import { Menu } from "../types";

interface StoreListItem {
  name: string;
  checked: Boolean;
  location: string;
}
const ShoppingList = () => {
  const [menu, setMenu] = useState<Menu>();
  const { id } = useParams();
  const [list, setList] = useState<StoreListItem[]>([]);

  const buildList = (menu: Menu) => {
    let list: StoreListItem[] = [];
    menu?.items.map((recipe) => {
      const objArray = recipe.ingredients.map((item) => {
        return { name: item, checked: false, location: "" };
      });
      list = list.concat(objArray);
      return list;
    });
    return list;
  };

  useEffect(() => {
    menuService.getSingleMenu(id).then((response) => {
      setMenu(response.data);
      const list = buildList(response.data);
      const sortedList = list.sort();
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
                {ingredient.name}{" "}
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
