import { Link } from "react-router-dom";
import { Menu, Recipe, User, isHeading } from "../../types";
import menuService from "../../services/menus";
import ServingsAmountInput from "./ServingsAmountInput";
import { userContext } from "../../utils/userContext";
import { useContext } from "react";
import recipeService from "../../services/recipes";

interface componentProps {
  menuItem: Recipe;
  i: number;
  menu: Menu;
  menus: Menu[];
  setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
  isPublic: boolean;
}

const MenuItem = ({
  menuItem,
  i,
  menu,
  setMenus,
  menus,
  isPublic,
}: componentProps) => {
  const currentUser = useContext(userContext) as User;

  const removeMenuItem = async () => {
    if (menuItem.id) await recipeService.deleteRecipe(menuItem.id);

    const updatedMenuRecipes = menu.items.filter(
      (recipeToRemove) => recipeToRemove.menuItemId !== menuItem.menuItemId
    );
    menu.items = updatedMenuRecipes;
    await menuService.updateMenu(menu.id, menu);

    let updatedMenus: Menu[] | undefined = [];
    if (isPublic) {
      updatedMenus = await menuService.getAllPublic();
    } else {
      updatedMenus = await menuService.getAllFromSingleUser(currentUser.id);
    }

    if (updatedMenus && updatedMenus.length > 0) {
      setMenus(updatedMenus);
    }
  };

  const handleCheckOffMenuItem = (event: any, recipe: Recipe) => {
    event.preventDefault();

    const updatedRecipe = { ...recipe, checked: !recipe.checked };
    const updatedMenu = menu.items.map((menuRecipe: Recipe) => {
      if (menuRecipe.menuItemId === recipe.menuItemId) {
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

  const handleRecipeServingAmountChange = (e: any) => {
    const menuItemBaseServings = menuItem.servings;
    const AmountToAddToEachIngredientAmount =
      e.target.value / menuItemBaseServings;
    const updatedIngredients = menuItem.ingredients.map((ingredient) => {
      if (!isHeading(ingredient) && ingredient.amount !== undefined) {
        return {
          ...ingredient,
          amount: parseFloat(
            (
              Number(ingredient.amount) *
              Number(AmountToAddToEachIngredientAmount)
            ).toFixed(2)
          ).toString(),
        };
      }

      return ingredient;
    });
    const updatedMenuItem = {
      ...menuItem,
      servings: e.target.value,
      ingredients: updatedIngredients,
    };
    const updatedItemsArray = menu.items.map((item) => {
      if (item.menuItemId === updatedMenuItem.menuItemId) {
        return updatedMenuItem;
      } else {
        return item;
      }
    });
    const updatedMenu = { ...menu, items: updatedItemsArray };
    const updatedMenus = menus.filter(
      (menusToFilter) => menusToFilter.id !== menu.id
    );
    setMenus([...updatedMenus, updatedMenu]);
    if (menuItem.id)
      recipeService.updateRecipe(menuItem.id, updatedMenuItem, null);
    menuService.updateMenu(menu.id, updatedMenu);
  };

  return (
    <>
      <h4
        style={{ textDecoration: menuItem.checked ? "line-through" : "none" }}
      >
        {menuItem.name}
      </h4>{" "}
      <ServingsAmountInput
        handleRecipeServingAmountChange={handleRecipeServingAmountChange}
        menuItem={menuItem}
      />
      <br></br>
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
