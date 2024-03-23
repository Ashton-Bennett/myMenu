import { Link } from "react-router-dom";
import { Recipe, Menu } from "../types";
import recipeService from "../services/recipes";
import BackButton from "../components/BackButton";
import menuService from "../services/menus";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import RecipeSearchBar from "../components/RecipeList/RecipeSearchBar";

export interface componentProps {
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  menus: Menu[];
  setMenus?: React.Dispatch<React.SetStateAction<Menu[]>>;
}

const RecipeList = ({
  menus,
  setMenus,
  recipes,
  setRecipes,
}: componentProps) => {
  const [filteredListOfRecipes, setFilteredListOfRecipes] = useState<Recipe[]>(
    []
  );

  useEffect(() => {
    setFilteredListOfRecipes(recipes);
  }, [recipes]);

  const handleDelete = async (recipe: string, id: string) => {
    if (
      window.confirm(`Are you sure you would like to delete ${recipe} recipe?`)
    ) {
      await recipeService.deleteRecipe(id);
      // eslint-disable-next-line eqeqeq
      const updatedRecipeList: Recipe[] | undefined =
        await recipeService.getAll();
      if (updatedRecipeList) {
        setRecipes(updatedRecipeList);
      }
    }
  };

  const handleAddRecipeToMenu = async (
    menuId: string | undefined,
    recipeId: string | undefined
  ) => {
    let recipeToAdd = recipes.find((recipe) => recipe.id === recipeId);
    if (recipeToAdd) recipeToAdd = { ...recipeToAdd, menuItemId: uuidv4() };
    const updatedMenu = menus.find((menu) => menu.id === menuId);
    if (updatedMenu && recipeToAdd) {
      updatedMenu.items = updatedMenu.items.concat(recipeToAdd);
      await menuService.updateMenu(menuId, updatedMenu);

      const updatedMenus = await menuService.getAll();
      if (updatedMenus && setMenus) {
        setMenus(updatedMenus);
      }
    }
  };

  return (
    <>
      <h2>Recipes:</h2>
      <br></br>
      <RecipeSearchBar
        recipes={recipes}
        filteredListOfRecipes={filteredListOfRecipes}
        setFilteredListOfRecipes={setFilteredListOfRecipes}
      />
      <br></br>

      {filteredListOfRecipes.map((recipe, i) => {
        return (
          <div key={recipe.name + i}>
            <h3>{recipe.name}</h3>
            <Link to={`/viewRecipes/${recipe.id}`}>
              <button>View</button>
            </Link>
            <Link to={`/updateRecipe/${recipe.id}`}>
              <button>Edit</button>
            </Link>
            <button
              onClick={() => handleDelete(`${recipe.name}`, `${recipe.id}`)}
            >
              Delete
            </button>
            <select
              onChange={(event) => {
                if (event.target.value && recipe.id) {
                  handleAddRecipeToMenu(event.target.value, recipe.id);
                }
              }}
            >
              <option value={undefined}>Add To Menu</option>
              {menus.map((menu, i) => {
                return (
                  <option value={menu.id} key={menu + (i + "")}>
                    {menu.name}
                  </option>
                );
              })}
            </select>
          </div>
        );
      })}
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <BackButton linkTo={"/"} />
    </>
  );
};

export default RecipeList;
