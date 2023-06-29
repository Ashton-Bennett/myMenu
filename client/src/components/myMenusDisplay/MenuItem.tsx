import { Link } from "react-router-dom";
import { Menu, Recipe } from "../../types";
import menuService from "../../services/menus";

interface componentProps {
  menuItem: Recipe;
  i: number;
  menu: Menu;
  setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
}

const MenuItem = ({ menuItem, i, menu, setMenus }: componentProps) => {
  const toggleStrikeThrough = (id: string) => {
    const menuItemToStrikeThrough = document.getElementById(id);
    if (menuItemToStrikeThrough) {
      const currentTextDecoration =
        menuItemToStrikeThrough.style.textDecoration;
      if (currentTextDecoration === "line-through") {
        menuItemToStrikeThrough.style.textDecoration = "none";
      } else {
        menuItemToStrikeThrough.style.textDecoration = "line-through";
      }
    }
  };

  const removeMenuItem = async () => {
    const updatedMenuRecipes = menu.items.filter(
      (recipeToRemove) => recipeToRemove.id !== menuItem.id
    );
    menu.items = updatedMenuRecipes;
    await menuService.updateMenu(menu.id, menu);
    const updatedMenus = await menuService.getAll();
    if (updatedMenus) {
      setMenus(updatedMenus);
    }
  };
  return (
    <>
      <h4 id={menuItem.name + i}>{menuItem.name}</h4>{" "}
      <Link to={`/viewRecipes/${menuItem.id}`}>
        <button>view</button>
      </Link>
      <button onClick={() => toggleStrikeThrough(menuItem.name + i)}>
        Strikethrough
      </button>
      <button onClick={removeMenuItem}>Remove from Menu</button>
      <br></br>
      <br></br>
    </>
  );
};

export default MenuItem;
