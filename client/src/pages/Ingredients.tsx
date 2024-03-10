import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import Staples from "../components/Ingredients/Staples";
import { User } from "../types";

interface componentProps {
  user?: User;
  setUser?: Function;
}
const Ingredients = ({ user, setUser }: componentProps) => {
  return (
    <>
      <h1>Ingredients:</h1>
      <p>Ingredients in the database:</p>
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
      <Staples user={user} setUser={setUser} />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <BackButton linkTo={"/"} />
    </>
  );
};

export default Ingredients;
