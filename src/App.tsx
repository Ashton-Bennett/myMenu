import RecipeList from "./components/RecipeList";
import RecipeForm from "./components/AddNewRecipeForm/RecipeForm";
import { useState } from "react";
import { Recipe } from "./types";
function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  return (
    <div>
      <header>Menu</header>
      <RecipeForm recipes={recipes} setRecipes={setRecipes} />
      <RecipeList recipes={recipes} />
    </div>
  );
}

export default App;
