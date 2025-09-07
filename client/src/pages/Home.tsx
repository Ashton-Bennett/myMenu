import { Link } from "react-router-dom";
import authService from "../services/auth";
import { useEffect } from "react";
import recipeService from "../services/recipes";
import menuService from "../services/menus";
import { Recipe, Menu } from "../types";
import { User } from "../types";

export interface componentProps {
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  setMenus?: React.Dispatch<React.SetStateAction<Menu[]>>;
  user: User;
}

const Home = ({ setRecipes, setMenus, user }: componentProps) => {
  const handleLogout = async () => {
    authService.logout();
    authService.removeAccessToken();
    window.location.href = "/";
  };

  useEffect(() => {
    recipeService.getAll().then((response) => {
      if (response && setRecipes) {
        setRecipes(response);
      }
    });

    menuService.getAllPublic().then((response) => {
      if (response && setMenus) {
        setMenus(response);
      }
    });
  }, []);

  return (
    <>
      <header>
        <h1>Welcome Chef {user.name}!</h1>
      </header>
      <div>
        <Link to="/viewRecipes">
          <button>View Recipes</button>
        </Link>
        <Link to="/addRecipe">
          <button>Add Recipe</button>
        </Link>
        <Link to="/menus">
          <button>Menus</button>
        </Link>
        <Link to="/myGroceryList">
          <button>My Grocery List</button>
        </Link>
        <Link to="/ingredients">
          <button>Ingredients</button>
        </Link>
        <Link to="/users">
          <button>Users</button>
        </Link>
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          alignItems: "center",
          bottom: "15px",
          position: "absolute",
          width: "375px",
        }}
      >
        <p onClick={handleLogout} title="logout">
          Logout
        </p>
        <a href="/legal/terms-of-use.html" title="terms of use">
          Terms of use
        </a>
        <a
          style={{ padding: "1rem" }}
          href="/legal/privacy-policy.html"
          title="privacy policy"
        >
          Privacy Policy
        </a>
      </div>
    </>
  );
};

export default Home;
