import { useState, useEffect, useContext } from "react";
import { Recipe, Menu, User } from "../../types";
import RecipeList from "../Recipes/RecipeList";
import menuService from "../../services/menus";
import { Link } from "react-router-dom";
import MenuItem from "../../components/Menus/MenuItem";
import BackButton from "../../components/BackButton";
import { userContext } from "../../utils/userContext";
import recipeService from "../../services/recipes";

interface ComponentProps {
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  menus: Menu[];
  setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
}
const MyMenus = ({ recipes, setRecipes, menus, setMenus }: ComponentProps) => {
  const storedMenuItemsString = sessionStorage.getItem("menuListsToDisplay");
  const [showMenuItems, setShowMenuItems] = useState<boolean[]>(
    storedMenuItemsString ? JSON.parse(storedMenuItemsString) : []
  );
  const currentUser = useContext(userContext) as User;

  useEffect(() => {
    menuService.getAllFromSingleUser(currentUser.id).then((response) => {
      if (response) {
        setMenus(response);
        // setShowMenuItems(Array(menus.length).fill(false));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menus.length]);

  const handleToggleViewMenu = (index: number) => {
    setShowMenuItems((prev) => {
      const updatedShowLists = [...prev];
      updatedShowLists[index] = !updatedShowLists[index];
      sessionStorage.setItem(
        "menuListsToDisplay",
        JSON.stringify(updatedShowLists)
      );
      return updatedShowLists;
    });
  };

  const handleDeleteMenu = async (
    id: string | undefined,
    name: string,
    menuItems: Recipe[]
  ) => {
    if (id) {
      if (
        window.confirm(`Are you sure you would like to delete ${name} menu?`)
      ) {
        menuItems.forEach(async (menuItem) => {
          console.log(menuItem);
          if (menuItem.id) await recipeService.deleteRecipe(menuItem.id);
        });

        await menuService.deleteMenu(id);
        const updatedMenus: Menu[] | undefined =
          await menuService.getAllFromSingleUser(currentUser.id);
        if (updatedMenus) {
          setMenus(updatedMenus);
          setShowMenuItems(Array(menus.length).fill(false));
        }
      }
    }
  };

  return (
    <>
      <h1>Chef {currentUser.name}'s Menus</h1>
      {menus.length < 1 ? (
        <p>No saved menus found...</p>
      ) : (
        menus.map((menu, i) => {
          return (
            <div key={menu.name + i}>
              {" "}
              <b>{menu.name}</b>{" "}
              <button onClick={() => handleToggleViewMenu(i)}>
                {showMenuItems[i] ? "hide" : "view"}
              </button>
              <button
                onClick={() => handleDeleteMenu(menu.id, menu.name, menu.items)}
              >
                delete
              </button>
              <Link to={`/shoppingList/${menu.id}`}>
                <button>Shopping List</button>
              </Link>
              <br></br>
              <br></br>
              {showMenuItems[i] &&
                menu.items.map((menuItem, i) => {
                  return (
                    <div key={menuItem.name + i}>
                      <MenuItem
                        menuItem={menuItem}
                        i={i}
                        menu={menu}
                        menus={menus}
                        setMenus={setMenus}
                        isPublic={false}
                      />
                    </div>
                  );
                })}
            </div>
          );
        })
      )}
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <Link to="/addPrivateMenu">
        <button>Add New Menu</button>
      </Link>
      <BackButton linkTo={"/menus"} />
      <br></br>
      <br></br>
      <hr></hr>
      <RecipeList
        setMenus={setMenus}
        menus={menus}
        recipes={recipes}
        setRecipes={setRecipes}
      />
    </>
  );
};

export default MyMenus;
