import RecipeList from "./pages/Recipes/RecipeList";
import "./global.css";
import RecipeForm from "./pages/Recipes/RecipeForm";
import { useEffect, useState } from "react";
import { Menu, Recipe, User } from "./types";
import Home from "./pages/Home";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import RecipeView from "./pages/Recipes/RecipeView";
import NotFound from "./pages/NotFound";
import UpdateRecipeForm from "./pages/Recipes/UpdateRecipeForm";
import MyMenus from "./pages/Menus/MyMenus";
import AddNewmenuForm from "./pages/Menus/AddNewMenuForm";
import ShoppingList from "./pages/GroceryList/ShoppingList";
import MyGroceryList from "./pages/GroceryList/MyGroceryList";
import userService from "./services/user";
import authService from "./services/auth";
import Ingredients from "./pages/Ingredients/Ingredients";
import IngredientUpdateForm from "./components/Ingredients/IngredientUpdateForm";
import AddIngredientForm from "./components/Ingredients/AddAndUpdateIngredientForm";
import IngredientsListView from "./components/Ingredients/IngredientsListView";
import { io } from "socket.io-client";
import Menus from "./pages/Menus/Menus";
import Login from "./pages/User/Login";
import { BrowserRouter } from "react-router-dom";
import { userContext } from "./utils/userContext";
import Users from "./pages/User/Users";
import LoadingScreen from "./pages/User/LoadingScreen";
import Details from "./pages/User/Details";
import CreateUser from "./pages/User/CreateUser";

const socket = io();
const updatedUserWithSocket = (userObj: User) => {
  socket.emit("update_user", userObj);
};

// ---- Route guards ----
function RequireAuth({ user }: { user?: User }) {
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

function GuestOnly({ user }: { user?: User }) {
  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
}

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [user, setUser] = useState<User>();
  const [authLoading, setAuthLoading] = useState(true);

  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const redirectedForNoToken = params.get("unauth") === "true";

  socket.connect();
  console.log("loaded APP COMPONENT", redirectedForNoToken);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!user) {
          const response = await authService.refreshToken();
          console.log("Refresh token response:", response);
          if (!response) {
            console.log("No response from refresh token");
            return;
          }
          if (response.foundUser) {
            const currentUser = await userService.getSingleUser(
              response.foundUser
            );
            setUser(currentUser);
          }
        }
      } finally {
        setAuthLoading(false);
      }
    };
    console.log("Checking auth...", redirectedForNoToken);
    if (redirectedForNoToken || window.location.search === "") {
      checkAuth();
    }
  }, []);

  useEffect(() => {
    if (user) {
      userService.updateUser(user.id, user);
    }
  }, [user]);

  if (authLoading) return <LoadingScreen />;

  return (
    <BrowserRouter>
      <userContext.Provider value={user!}>
        {/* key forces remount when auth state flips, avoiding stale matches */}
        <Routes key={user ? "auth" : "guest"}>
          {/* Public / guest-only */}
          <Route element={<GuestOnly user={user} />}>
            <Route
              path="/login"
              element={<Login user={user} setUser={setUser} />}
            />
            <Route
              path="/users/create"
              element={<CreateUser user={user} setUser={setUser} />}
            />
          </Route>

          {/* Protected routes */}
          <Route element={<RequireAuth user={user} />}>
            <Route
              path="/"
              element={
                <Home
                  setRecipes={setRecipes}
                  setMenus={setMenus}
                  user={user!}
                />
              }
            />
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
            <Route path="/viewMenuRecipe/:id" element={<RecipeView />} />
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
              element={<AddNewmenuForm user={user!} typeOfMenu="private" />}
            />
            <Route
              path="/addPublicMenu"
              element={<AddNewmenuForm user={user!} typeOfMenu="public" />}
            />
            <Route
              path="/shoppingList/:id"
              element={
                <ShoppingList
                  setUser={setUser}
                  user={user!}
                  updatedUserWithSocket={updatedUserWithSocket}
                />
              }
            />
            <Route
              path="/myGroceryList"
              element={
                <MyGroceryList
                  setUser={setUser}
                  user={user!}
                  socket={socket}
                  updatedUserWithSocket={updatedUserWithSocket}
                />
              }
            />
            <Route
              path="/ingredients"
              element={<Ingredients user={user!} setUser={setUser} />}
            />
            <Route
              path="/ingredients/update/:id"
              element={<IngredientUpdateForm />}
            />
            <Route path="/ingredients/view" element={<IngredientsListView />} />
            <Route
              path="/ingredients/addNew"
              element={<AddIngredientForm componentType="add" />}
            />
            <Route path="/users" element={<Users />} />
            <Route path="/users/userDetails/:userId" element={<Details />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </userContext.Provider>
    </BrowserRouter>
  );
}

export default App;
