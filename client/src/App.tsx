import RecipeList from "./pages/Recipes/RecipeList";
import "./global.css";
import RecipeForm from "./pages/Recipes/RecipeForm";
import { useEffect, useState } from "react";
import { Menu, Recipe, User } from "./types";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import RecipeView from "./pages/Recipes/RecipeView";
import recipeService from "./services/recipes";
import NotFound from "./pages/NotFound";
import UpdateRecipeForm from "./pages/Recipes/UpdateRecipeForm";
import MyMenus from "./pages/Menus/MyMenus";
import AddNewmenuForm from "./pages/Menus/AddNewMenuForm";
import menuService from "./services/menus";
import ShoppingList from "./pages/GroceryList/ShoppingList";
import MyGroceryList from "./pages/GroceryList/MyGroceryList";
import userService from "./services/user";
import Ingredients from "./pages/Ingredients/Ingredients";
import IngredientUpdateForm from "./components/Ingredients/IngredientUpdateForm";
import AddIngredientForm from "./components/Ingredients/AddAndUpdateIngredientForm";
import IngredientsListView from "./components/Ingredients/IngredientsListView";
import { io } from "socket.io-client";
import Menus from "./pages/Menus/Menus";
import Login from "./pages/User/Login";
import { BrowserRouter } from "react-router-dom";
import { userContext } from "./utils/userContext";

const socket = io();
const updatedUserWithSocket = (userObj: User) => {
  socket.emit("update_user", userObj);
};
function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    recipeService.getAll().then((response) => {
      if (response) {
        setRecipes(response);
      }
    });

    menuService.getAllPublic().then((response) => {
      if (response) {
        setMenus(response);
      }
    });

    userService.getAll().then((response) => {
      if (response) {
        setUser(response[0]);
      }
    });

    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (user) {
      userService.updateUser(user.id, user);
    }
  }, [user]);

  return (
    <BrowserRouter>
      {user ? (
        <userContext.Provider value={user}>
          <Routes>
            <>
              <Route path="/" element={<Home />} />
              <Route
                path="/addRecipe"
                element={
                  <RecipeForm recipes={recipes} setRecipes={setRecipes} />
                }
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
              <Route
                path="/viewRecipes/:id"
                element={<RecipeView isMenuRecipe={false} />}
              />
              <Route
                path="/viewMenuRecipe/:id"
                element={<RecipeView isMenuRecipe={true} />}
              />
              <Route
                path="/updateRecipe/:id"
                element={
                  <UpdateRecipeForm recipes={recipes} setRecipes={setRecipes} />
                }
              />

              <Route
                path="/menus"
                element={
                  <Menus
                    menus={menus}
                    setMenus={setMenus}
                    recipes={recipes}
                    setRecipes={setRecipes}
                  />
                }
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

              <Route
                path="/addPrivateMenu"
                element={<AddNewmenuForm user={user} typeOfMenu={"private"} />}
              />
              <Route
                path="/addPublicMenu"
                element={<AddNewmenuForm user={user} typeOfMenu={"public"} />}
              />
              <Route
                path="/shoppingList/:id"
                element={
                  <ShoppingList
                    setUser={setUser}
                    user={user}
                    updatedUserWithSocket={updatedUserWithSocket}
                  />
                }
              />
              <Route
                path="/myGroceryList"
                element={
                  user ? (
                    <MyGroceryList
                      setUser={setUser}
                      user={user}
                      socket={socket}
                      updatedUserWithSocket={updatedUserWithSocket}
                    />
                  ) : (
                    <NotFound />
                  )
                }
              />
              <Route
                path="/ingredients"
                element={<Ingredients user={user} setUser={setUser} />}
              />
              <Route
                path="/ingredients/update/:id"
                element={<IngredientUpdateForm />}
              />
              <Route
                path="/ingredients/view"
                element={<IngredientsListView />}
              />
              <Route
                path="/ingredients/addNew"
                element={<AddIngredientForm componentType="add" />}
              />
              <Route path="*" element={<NotFound />} />
            </>
          </Routes>
        </userContext.Provider>
      ) : (
        <Login />
      )}
    </BrowserRouter>
  );
}

export default App;
