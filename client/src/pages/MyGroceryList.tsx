import BackButton from "../components/BackButton";
import { useEffect, useState } from "react";
import { Ingredient } from "../types";
import { User } from "../types";
import groceryListService from "../services/groceryList";
import AddItemForm from "../components/myGroceryList/AddItemForm";
import DisplayGroceryList from "../components/myGroceryList/DisplayGroceryList";
import findIngredientShoppingLocationAndAddID from "../utils/ingredientShoppingLocation";
import ingredients from "../services/ingredients";

interface ComponentProps {
  setUser: Function;
  user: User;
  updatedUserWithSocket: Function;
  socket: any;
}

const MyGroceryList = ({
  setUser,
  user,
  updatedUserWithSocket,
  socket,
}: ComponentProps) => {
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
    socket.on("share_updated_user", (data: User) => {
      setUser(data);
    });

    return () => {
      socket.off("share_updated_user", (data: User) => {
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

      (user?.userGroceryList as Ingredient[]).forEach((ingredient) => {
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

  const handleClearCheckedIngredients = async (event: any) => {
    event.preventDefault();
    if (user) {
      groceryListService.clearList(user.id);
      const userGroceryList = await groceryListService.getGroceryList(user.id);

      const filteredGroceryList = userGroceryList?.filter(
        (ingredient) => !ingredient.checked
      );

      setUser((prev: any) => ({
        ...prev,
        userGroceryList: filteredGroceryList,
      }));
      updatedUserWithSocket({ ...user, userGroceryList: filteredGroceryList });
    }
  };

  const addStaples = () => {
    const arrayOfNewIngredients = user.userStapleIngredients.quickAddItems
      .filter((ingredient) => {
        return !ingredient.checked;
      })
      .map((ingredient) => {
        return findIngredientShoppingLocationAndAddID(ingredient);
      });

    setUser((prev: User) => ({
      ...prev,
      userGroceryList: [
        ...prev.userGroceryList,
        ...arrayOfNewIngredients.flat(),
      ],
    }));

    updatedUserWithSocket({
      ...user,
      userGroceryList: [
        ...user.userGroceryList,
        ...arrayOfNewIngredients.flat(),
      ],
    });

    console.log(user.userGroceryList);
  };

  return (
    <>
      <h1 id="top">My Grocery List</h1>
      <button type="button" onClick={addStaples}>
        Quickly Add Staples
      </button>
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
      <button style={{ marginRight: "4px" }} onClick={handleClearList}>
        Clear list
      </button>
      <button
        style={{ marginRight: "4px" }}
        onClick={handleClearCheckedIngredients}
      >
        Remove Checked Items
      </button>
      <BackButton linkTo={"/"} />
    </>
  );
};

export default MyGroceryList;
