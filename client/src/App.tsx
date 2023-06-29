import RecipeList from "./pages/RecipeList";
import RecipeForm from "./pages/RecipeForm";
import { useEffect, useState } from "react";
import { Menu, Recipe } from "./types";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import RecipeView from "./pages/RecipeView";
import recipeService from "./services/recipes";
import NotFound from "./pages/NotFound";
import UpdateRecipeForm from "./pages/UpdateRecipeForm";
import MyMenus from "./pages/MyMenus";
import AddNewmenuForm from "./pages/AddNewMenuForm";
import menuService from "./services/menus";

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);

  useEffect(() => {
    recipeService.getAll().then((response) => {
      if (response) {
        setRecipes(response);
      }
    });

    menuService.getAll().then((response) => {
      if (response) {
        setMenus(response);
      }
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/addRecipe"
        element={<RecipeForm recipes={recipes} setRecipes={setRecipes} />}
      />
      <Route
        path="/viewRecipes"
        element={
          <RecipeList
            menus={menus}
            setMenus={setMenus}
            recipes={recipes}
            setRecipes={setRecipes}
          />
        }
      />
      <Route path="/viewRecipes/:id" element={<RecipeView />} />
      <Route
        path="/updateRecipe/:id"
        element={<UpdateRecipeForm recipes={recipes} setRecipes={setRecipes} />}
      />

      <Route
        path="/myMenus"
        element={
          <MyMenus
            menus={menus}
            setMenus={setMenus}
            recipes={recipes}
            setRecipes={setRecipes}
          />
        }
      />

      <Route path="/addMenu" element={<AddNewmenuForm />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
