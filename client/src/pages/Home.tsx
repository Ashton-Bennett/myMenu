import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <header>
        <h1>The Menu</h1>

        <p> The app that turns home cooks into restaurant chefs </p>
      </header>
      <div>
        <Link to="/viewRecipes">
          <button>View Recipes</button>
        </Link>
        <Link to="/addRecipe">
          <button>Add Recipe</button>
        </Link>
        <Link to="/myMenus">
          <button>My Menus</button>
        </Link>
        <Link to="/myGroceryList">
          <button>My Grocery List</button>
        </Link>
        <Link to="/ingredients">
          <button>Ingredients</button>
        </Link>
      </div>
    </>
  );
};

export default Home;
