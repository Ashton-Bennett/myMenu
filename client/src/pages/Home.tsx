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
        <Link to="/menus">
          <button>Menus</button>
        </Link>
        <Link to="/myGroceryList">
          <button>My Grocery List</button>
        </Link>
        <Link to="/ingredients">
          <button>Ingredients</button>
        </Link>
      </div>
      <div style={{ bottom: "15px", position: "absolute", width: "375px" }}>
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
