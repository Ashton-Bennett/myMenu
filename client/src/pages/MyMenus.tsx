import { useState, useEffect } from "react";
import { Recipe, Menu } from "../types";
import RecipeList from "./RecipeList";
import menuService from "../services/menus";
import { Link } from "react-router-dom";
import MenuItem from "../components/myMenusDisplay/MenuItem";

interface ComponentProps {
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  menus: Menu[];
  setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
}
const MyMenus = ({ recipes, setRecipes, menus, setMenus }: ComponentProps) => {
  const [showMenuItems, setShowMenuItems] = useState<boolean[]>([]);

  useEffect(() => {
    menuService.getAll().then((response) => {
      if (response) {
        setMenus(response);
        setShowMenuItems(Array(menus.length).fill(false));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menus.length]);

  const handleToggleViewMenu = (index: number) => {
    setShowMenuItems((prev) => {
      const updatedShowLists = [...prev];
      updatedShowLists[index] = !updatedShowLists[index];
      return updatedShowLists;
    });
  };

  const handleDeleteMenu = async (id: string | undefined, name: string) => {
    if (id) {
      if (
        window.confirm(`Are you sure you would like to delete ${name} menu?`)
      ) {
        await menuService.deleteMenu(id);
        const updatedMenus: Menu[] | undefined = await menuService.getAll();
        if (updatedMenus) {
          setMenus(updatedMenus);
          setShowMenuItems(Array(menus.length).fill(false));
        }
      }
    }
  };

  return (
    <>
      <h1>My Menus</h1>
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
              <button onClick={() => handleDeleteMenu(menu.id, menu.name)}>
                delete
              </button>
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
                        setMenus={setMenus}
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
      <Link to="/addMenu">
        <button>Add New Menu</button>
      </Link>
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
