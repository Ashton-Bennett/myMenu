import { useState, useEffect } from "react";
import { Recipe, Menu } from "../../types";
import menuService from "../../services/menus";
import { Link } from "react-router-dom";
import MenuItem from "../../components/Menus/MenuItem";
import BackButton from "../../components/BackButton";

interface ComponentProps {
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  menus: Menu[];
  setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
}
const Menus = ({ menus, setMenus }: ComponentProps) => {
  const [showMenuItems, setShowMenuItems] = useState<boolean[]>([]);

  useEffect(() => {
    menuService.getAllPublic().then((response) => {
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

  return (
    <>
      <h1>Public Menus</h1>
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
                        isPublic={true}
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
      <Link to="/addPublicMenu">
        <button>Add New Menu</button>
      </Link>
      <Link to="/MyMenus">
        <button>Private Menus</button>
      </Link>
      <BackButton linkTo={"/"} />
      <br></br>
      <br></br>
    </>
  );
};

export default Menus;
