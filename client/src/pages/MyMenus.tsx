import { useState, useEffect } from "react";
import { Recipe, Menu } from "../types";
import RecipeList from "./RecipeList";
import menuService from "../services/menus";
import { Link } from "react-router-dom";

interface ComponentProps {
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
}
const MyMenus = ({ recipes, setRecipes }: ComponentProps) => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [showMenuItems, setShowMenuItems] = useState<boolean[]>([]);

  useEffect(() => {
    menuService.getAll().then((response) => {
      if (response) {
        setMenus(response);
        setShowMenuItems(Array(menus.length).fill(false));
      }
    });
  }, []);

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
        menuService.deleteMenu(id);
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
          console.log("HERE", menu.id);
          return (
            <div key={menu.name + i}>
              {" "}
              <b>{menu.name}</b>{" "}
              <button onClick={() => handleToggleViewMenu(i)}>
                {showMenuItems[i] ? "hide" : "view"}
              </button>
              <button>update</button>
              <button onClick={() => handleDeleteMenu(menu.id, menu.name)}>
                delete
              </button>
              <br></br>
              <br></br>
              {showMenuItems[i] &&
                menu.items.map((menuItem, i) => {
                  return (
                    <div key={menuItem.name + i}>
                      <i>{menuItem.name}</i> <button>view</button>
                      <button>Strikethrough</button>
                      <br></br>
                      <br></br>
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
      <RecipeList recipes={recipes} setRecipes={setRecipes} />
    </>
  );
};

export default MyMenus;
