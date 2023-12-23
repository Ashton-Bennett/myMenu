import BackButton from "../components/BackButton";
import { useEffect, useState } from "react";
import { Ingredient } from "../types";
import { User } from "../types";
import groceryListService from "../services/groceryList";
import AddItemForm from "../components/myGroceryList/AddItemForm";
import DisplayGroceryList from "../components/myGroceryList/DisplayGroceryList";
import { io } from "socket.io-client";
// sometimes http://localhost:3000
export const socket = io(undefined);
export const updatedUserWithSocket = (userObj: User) => {
  socket.emit("update_user", userObj);
};

interface ComponentProps {
  setUser: Function;
  user: User;
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
  const [scrollToTop, setScrollToTop] = useState(true);

  useEffect(() => {
    socket.connect();
    updatedUserWithSocket({ ...user });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("share_updated_user", (data) => {
      setUser(data);
    });

    return () => {
      socket.off("share_updated_user", (data) => {
        setUser(data);
      });
    };
  }, [socket]);

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
          produce = produce.concat({ ...ingredient, name: ingredient.name });
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

      setDairyList(dairy);
      setOtherList(other);
      setProduceList(produce);
      setMeatDepartmentList(meat);
      setMiddleAislesList(middleAisles);
      setFrozenList(frozen);
      setDeliList(deli);
      setScrollToTop(false);
    }
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [scrollToTop]);

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
      updatedUserWithSocket({ ...user, userGroceryList: [] });
    }
  };

  return (
    <>
      <h1 id="top">My Grocery List</h1>
      <DisplayGroceryList
        name={"Deli"}
        list={deliList}
        user={user}
        setUser={setUser}
        socket={updatedUserWithSocket}
      />

      <DisplayGroceryList
        name={"Produce"}
        list={produceList}
        user={user}
        setUser={setUser}
        socket={updatedUserWithSocket}
      />

      <DisplayGroceryList
        name={"Middle Aisles"}
        list={middleAislesList}
        user={user}
        setUser={setUser}
        socket={updatedUserWithSocket}
      />

      <DisplayGroceryList
        name={"Meat Department"}
        list={meatDepartmentList}
        user={user}
        setUser={setUser}
        socket={updatedUserWithSocket}
      />

      <DisplayGroceryList
        name={"Frozen"}
        list={frozenList}
        user={user}
        setUser={setUser}
        socket={updatedUserWithSocket}
      />

      <DisplayGroceryList
        name={"Dairy"}
        list={dairyList}
        user={user}
        setUser={setUser}
        socket={updatedUserWithSocket}
      />

      <DisplayGroceryList
        name={"Other"}
        list={otherList}
        user={user}
        setUser={setUser}
        socket={updatedUserWithSocket}
      />

      <br></br>
      <br></br>
      <br></br>
      <AddItemForm
        socket={updatedUserWithSocket}
        user={user}
        setUser={setUser}
      />
      <br></br>
      <br></br>
      <button onClick={handleClearList}>Clear list</button>
      <BackButton linkTo={"/"} />
    </>
  );
};

export default MyGroceryList;
