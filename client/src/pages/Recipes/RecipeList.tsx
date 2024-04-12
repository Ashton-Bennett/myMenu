import { Link } from "react-router-dom";
import { Recipe, Menu, User } from "../../types";
import recipeService from "../../services/recipes";
import BackButton from "../../components/BackButton";
import menuService from "../../services/menus";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import RecipeSearchBar from "../../components/Recipes/RecipeList/RecipeSearchBar";
import { userContext } from "../../utils/userContext";
import { useContext } from "react";

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
  const currentUser = useContext(userContext) as User;

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
        setFilteredListOfRecipes((prev) => [...prev]);
        document.getElementById("clearFiltersButton")?.click();
      }
    }
  };

  const handleAddRecipeToMenu = async (
    menuId: string | undefined,
    recipeId: string | undefined
  ) => {
    if (menuId !== "Add To Menu") {
      const recipeToAddOriginalDontMutate = recipes.find(
        (recipe) => recipe.id === recipeId
      );
      let recipeToAdd = { ...recipeToAddOriginalDontMutate };
      if (recipeToAdd) {
        delete recipeToAdd.id;
        recipeToAdd = {
          ...recipeToAdd,
          menuItemId: uuidv4(),
          isMenuDuplicate: true,
        };
        recipeToAdd = await recipeService.addRecipe(recipeToAdd as Recipe);
      }

      const updatedMenu = menus.find((menu) => menu.id === menuId);

      if (updatedMenu && recipeToAdd) {
        updatedMenu.items = updatedMenu.items.concat(recipeToAdd as Recipe);
        await menuService.updateMenu(menuId, updatedMenu);

        let updatedMenus: Menu[] | undefined = [];
        if (updatedMenu.isPublic) {
          updatedMenus = await menuService.getAllPublic();
        } else {
          updatedMenus = await menuService.getAllFromSingleUser(currentUser.id);
        }

        if (updatedMenus && setMenus) {
          setMenus(updatedMenus);
        }
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
