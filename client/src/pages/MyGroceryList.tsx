import BackButton from "../components/BackButton";
import { useEffect, useState } from "react";
import { Ingredient } from "../types";
import { User } from "../types";
import groceryListService from "../services/groceryList";
import { sortByName } from "../utils/sortByName";
import AddItemForm from "../components/myGroceryList/AddItemForm";

interface ComponentProps {
  setUser: Function;
  user?: User;
}

const MyGroceryList = ({ setUser, user }: ComponentProps) => {
  const [produceList, setProduceList] = useState<Ingredient[]>([]);
  const [meatDepartmentList, setMeatDepartmentList] = useState<Ingredient[]>(
    []
  );
  const [dairyList, setDairyList] = useState<Ingredient[]>([]);
  const [middleAislesList, setMiddleAislesList] = useState<Ingredient[]>([]);
  const [otherList, setOtherList] = useState<Ingredient[]>([]);
  const [frozenList, setFrozenList] = useState<Ingredient[]>([]);
  const [deliList, setDeliList] = useState<Ingredient[]>([]);

  useEffect(() => {
    if (user) {
      let produce: Ingredient[] = [];
      let meat: Ingredient[] = [];
      let dairy: Ingredient[] = [];
      let middleAisles: Ingredient[] = [];
      let frozen: Ingredient[] = [];
      let deli: Ingredient[] = [];
      let other: Ingredient[] = [];

      (user.userGroceryList as Ingredient[]).forEach((ingredient) => {
        if (ingredient.groceryStoreLocation === "produce") {
          produce = produce.concat(ingredient);
        } else if (ingredient.groceryStoreLocation === "dairy") {
          dairy = dairy.concat(ingredient);
        } else if (ingredient.groceryStoreLocation === "meat department") {
          meat = meat.concat(ingredient);
        } else if (ingredient.groceryStoreLocation === "middle aisles") {
          middleAisles = middleAisles.concat(ingredient);
        } else if (ingredient.groceryStoreLocation === "deli") {
          deli = deli.concat(ingredient);
        } else if (ingredient.groceryStoreLocation === "frozen") {
          frozen = frozen.concat(ingredient);
        } else {
          other = other.concat(ingredient);
        }
      });

      setDairyList((prev) => [...prev, ...dairy]);
      setOtherList((prev) => [...prev, ...other]);
      setProduceList((prev) => [...prev, ...produce]);
      setMeatDepartmentList((prev) => [...prev, ...meat]);
      setMiddleAislesList((prev) => [...prev, ...middleAisles]);
      setFrozenList((prev) => [...prev, ...frozen]);
      setDeliList((prev) => [...prev, ...deli]);
    }
  }, [user]);

  const deleteIngredient = (event: any) => {
    event.preventDefault();
    console.log(event.target.value);
  };

  const handleClearList = (event: any) => {
    event.preventDefault();
    if (user) {
      groceryListService.clearList(user.id);
      setOtherList([]);
      setMiddleAislesList([]);
      setDairyList([]);
      setMeatDepartmentList([]);
      setProduceList([]);
      setFrozenList([]);
      setDeliList([]);
      setUser((prev: any) => ({ ...prev, userGroceryList: [] }));
    }
  };
  console.log(user);
  return (
    <>
      <h1>My Grocery List</h1>

      <br></br>
      <br></br>
      <h2>Deli:</h2>
      {deliList.sort(sortByName).map((ingredient, i) => {
        return (
          <div key={ingredient.name + i}>
            <p>
              {ingredient.name} {ingredient.amount} {ingredient.unitOfMeasure}
              <button
                value={`${ingredient.name}${i}`}
                onClick={deleteIngredient}
              >
                Delete
              </button>
              <button>Check off</button>
            </p>{" "}
          </div>
        );
      })}
      <br></br>
      <br></br>
      <h2>Produce:</h2>
      {produceList.sort(sortByName).map((ingredient, i) => {
        return (
          <div key={ingredient.name + i}>
            <p>
              {ingredient.name} {ingredient.amount} {ingredient.unitOfMeasure}
              <button
                value={`${ingredient.name}${i}`}
                onClick={deleteIngredient}
              >
                Delete
              </button>
              <button>Check off</button>
            </p>{" "}
          </div>
        );
      })}
      <br></br>
      <br></br>

      <h2>Middle Aisles:</h2>

      {middleAislesList.sort(sortByName).map((ingredient, i) => {
        return (
          <div key={ingredient.name + i}>
            <p>
              {ingredient.name} {ingredient.amount} {ingredient.unitOfMeasure}
              <button
                value={`${ingredient.name}${i}`}
                onClick={deleteIngredient}
              >
                Delete
              </button>
              <button>Check off</button>
            </p>{" "}
          </div>
        );
      })}
      <br></br>
      <br></br>

      <h2>Meat Department:</h2>

      {meatDepartmentList.sort(sortByName).map((ingredient, i) => {
        return (
          <div key={ingredient.name + i}>
            <p>
              {ingredient.name} {ingredient.amount} {ingredient.unitOfMeasure}
              <button
                value={`${ingredient.name}${i}`}
                onClick={deleteIngredient}
              >
                Delete
              </button>
              <button>Check off</button>
            </p>{" "}
          </div>
        );
      })}
      <br></br>
      <br></br>

      <h2>Frozen:</h2>
      {frozenList.sort(sortByName).map((ingredient, i) => {
        return (
          <div key={ingredient.name + i}>
            <p>
              {ingredient.name} {ingredient.amount} {ingredient.unitOfMeasure}
              <button
                value={`${ingredient.name}${i}`}
                onClick={deleteIngredient}
              >
                Delete
              </button>
              <button>Check off</button>
            </p>{" "}
          </div>
        );
      })}
      <br></br>
      <br></br>
      <h2>Dairy:</h2>

      {dairyList.sort(sortByName).map((ingredient, i) => {
        return (
          <div key={ingredient.name + i}>
            <p>
              {ingredient.name} {ingredient.amount} {ingredient.unitOfMeasure}
              <button
                value={`${ingredient.name}${i}`}
                onClick={deleteIngredient}
              >
                Delete
              </button>
              <button>Check off</button>
            </p>{" "}
          </div>
        );
      })}
      <br></br>
      <br></br>

      <h2>Other:</h2>
      {otherList.sort(sortByName).map((ingredient, i) => {
        return (
          <div key={ingredient.name + i}>
            <p>
              {ingredient.name} {ingredient.amount} {ingredient.unitOfMeasure}
              <button
                value={`${ingredient.name}${i}`}
                onClick={deleteIngredient}
              >
                Delete
              </button>
              <button>Check off</button>
            </p>{" "}
          </div>
        );
      })}

      <br></br>
      <br></br>

      <br></br>
      <AddItemForm user={user} setUser={setUser} />
      <br></br>
      <br></br>
      <button onClick={handleClearList}>Clear list</button>
      <BackButton linkTo={"/"} />
    </>
  );
};

export default MyGroceryList;
