import { Link } from "react-router-dom";
import { Menu, Recipe, User } from "../../types";
import menuService from "../../services/menus";

interface componentProps {
  menuItem: Recipe;
  i: number;
  menu: Menu;
  menus: Menu[];
  setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
}

const MenuItem = ({ menuItem, i, menu, setMenus, menus }: componentProps) => {
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

  const handleCheckOffMenuItem = (event: any, recipe: Recipe) => {
    event.preventDefault();

    const updatedRecipe = { ...recipe, checked: !recipe.checked };
    const updatedMenu = menu.items.map((menuRecipe: Recipe) => {
      if (menuRecipe.id === recipe.id) {
        return updatedRecipe;
      }
      return menuRecipe;
    });

    const updatedMenus = menus.map((outerMenus) => {
      if (outerMenus.id === menu.id) {
        return { ...menu, items: updatedMenu };
      }
      return outerMenus;
    });
    menuService.updateMenu(menu.id, { ...menu, items: updatedMenu });
    setMenus(updatedMenus);
  };
  return (
    <>
      <h4
        style={{ textDecoration: menuItem.checked ? "line-through" : "none" }}
      >
        {menuItem.name}
      </h4>{" "}
      <Link to={`/viewRecipes/${menuItem.id}`}>
        <button>view</button>
      </Link>
      <button onClick={(e) => handleCheckOffMenuItem(e, menuItem)}>
        Strikethrough
      </button>
      <button onClick={removeMenuItem}>Remove from Menu</button>
      <br></br>
      <br></br>
    </>
  );
};

export default MenuItem;
