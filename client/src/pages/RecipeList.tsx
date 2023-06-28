import { Link } from "react-router-dom";
import { Recipe } from "../types";
import recipeService from "../services/recipes";
import BackButton from "../components/BackButton";

export interface componentProps {
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
}

const RecipeList = ({ recipes, setRecipes }: componentProps) => {
  const handleDelete = async (recipe: string, id: string) => {
    if (
      window.confirm(`Are you sure you would like to delete ${recipe} recipe?`)
    ) {
      recipeService.deleteRecipe(id);
      // eslint-disable-next-line eqeqeq
      const updatedRecipeList: Recipe[] | undefined =
        await recipeService.getAll();
      if (updatedRecipeList) {
        setRecipes(updatedRecipeList);
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
            <button>Add To Menu</button>
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
