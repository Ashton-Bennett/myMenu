import BackButton from "../components/BackButton";
import { useState } from "react";
import { Ingredient } from "../types";
const MyGroceryList = () => {
  const [produceList, setProduceList] = useState<Ingredient[]>([]);
  const [meatDepartmentList, setmeatDeparmentList] = useState<Ingredient[]>([]);
  const [dairyList, setDairyList] = useState<Ingredient[]>([]);
  const [middleAislesList, setMiddleAislesList] = useState<Ingredient[]>([]);
  const [unknownList, setUnknownList] = useState<Ingredient[]>([]);

  return (
    <>
      <h1>My Grocery List</h1>

      <br></br>
      <br></br>
      <h2>Produce:</h2>
      <button>Delete</button>
      <button>Check off</button>
      <br></br>
      <br></br>

      <h2>Middle Aisles:</h2>
      <button>Delete</button>
      <button>Check off</button>
      <br></br>
      <br></br>

      <h2>Meat Department:</h2>
      <button>Delete</button>
      <button>Check off</button>
      <br></br>
      <br></br>

      <h2>Dairy:</h2>
      <button>Delete</button>
      <button>Check off</button>
      <br></br>
      <br></br>

      <h2>Other:</h2>
      <button>Delete</button>
      <button>Check off</button>
      <br></br>
      <br></br>

      <br></br>
      <form>
        <label>
          Add item
          <input type="text"></input>
        </label>
        <label>
          Amount
          <input type="text"></input>
        </label>
        <select>
          <option value={""}>Section</option>
          <option value={"Produce"}>Produce</option>
          <option value={"Meat Department"}>Meat Department</option>
          <option value={"Dairy"}>Dairy</option>
          <option value={"Middle Aisle"}>Middle Aisle</option>
        </select>
        <button type="submit">Add</button>
      </form>
      <br></br>
      <br></br>
      <button>Clear list</button>
      <BackButton linkTo={undefined} />
    </>
  );
};

export default MyGroceryList;
