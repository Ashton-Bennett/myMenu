import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";

const Ingredients = () => {
  return (
    <>
      <h1>Ingredients:</h1>
      <Link to="/ingredients/addNew">
        <button>Add</button>
      </Link>
      <span> </span>
      <Link to="/ingredients/view">
        <button>View</button>
      </Link>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <BackButton linkTo={"/"} />
    </>
  );
};

export default Ingredients;
