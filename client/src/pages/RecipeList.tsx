import { Link } from "react-router-dom";
import { Recipe, Menu } from "../types";
import recipeService from "../services/recipes";
import BackButton from "../components/BackButton";
import menuService from "../services/menus";

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
  const handleDelete = async (recipe: string, id: string) => {
    if (
      window.confirm(`Are you sure you would like to delete ${recipe} recipe?`)
    ) {
      await recipeService.deleteRecipe(id);
      // eslint-disable-next-line eqeqeq
      const updatedRecipeList: Recipe[] | undefined =
        await recipeService.getAll();
      if (updatedRecipeList) {
        console.log(updatedRecipeList);
        setRecipes(updatedRecipeList);
      }
    }
  };

  const handleAddRecipeToMenu = async (
    menuId: string | undefined,
    recipeId: string | undefined
  ) => {
    const recipeToAdd = recipes.find((recipe) => recipe.id === recipeId);
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
      <h2> Recipes:</h2>
      {recipes.map((recipe, i) => {
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
