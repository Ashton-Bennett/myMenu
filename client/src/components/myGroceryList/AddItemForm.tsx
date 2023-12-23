import { useState } from "react";
import { User, Ingredient, groceryStoreLocation } from "../../types";
import { v4 as uuidv4 } from "uuid";

interface componentProps {
  user?: User;
  setUser: Function;
  socket: Function;
}
const AddItemForm = ({ user, setUser, socket }: componentProps) => {
  const [inputValues, setInputValues] = useState<Ingredient>({
    name: "",
    alias: [],
    pairings: [],
    season: [],
    amount: "",
    groceryStoreLocation: "unknown",
    groceryListId: uuidv4(),
  });

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (user) {
      const updatedUser = {
        ...user,
        userGroceryList: [...user.userGroceryList, inputValues],
      };
      setUser(updatedUser);
      socket(updatedUser);
    }

    setInputValues({
      name: "",
      alias: [],
      pairings: [],
      season: [],
      amount: "",
      groceryStoreLocation: "unknown",
      groceryListId: uuidv4(),
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <h3>Add item</h3>
      <label htmlFor="name">
        Name
        <input
          required
          value={inputValues.name}
          onChange={(e) =>
            setInputValues({
              ...inputValues,
              name: e.target.value,
              alias: [e.target.value],
            })
          }
          id="name"
          type="text"
        />
      </label>
      <label htmlFor="amount">
        Amount
        <input
          id="amount"
          value={inputValues.amount}
          onChange={(e) =>
            setInputValues({ ...inputValues, amount: e.target.value })
          }
          type="text"
        />
      </label>
      <select
        onChange={(e) =>
          setInputValues({
            ...inputValues,
            groceryStoreLocation: e.target.value as groceryStoreLocation,
          })
        }
        value={inputValues.groceryStoreLocation}
      >
        <option value={""}>Section</option>
        <option value={"deli"}>Deli</option>
        <option value={"produce"}>Produce</option>
        <option value={"middle aisles"}>Middle Aisles</option>
        <option value={"meat department"}>Meat Department</option>
        <option value={"frozen"}>Frozen</option>
        <option value={"dairy"}>Dairy</option>
        <option value={"other"}>Other</option>
      </select>
      <button type="submit">Add</button>
    </form>
  );
};

export default AddItemForm;
