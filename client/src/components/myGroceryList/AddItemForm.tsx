import { useState } from "react";
import { User, Ingredient } from "../../types";
import userService from "../../services/user";

interface componentProps {
  user?: User;
  setUser: Function;
}
const AddItemForm = ({ user, setUser }: componentProps) => {
  const [inputValues, setInputValues] = useState<Ingredient>({
    name: "",
    amount: "",
    groceryStoreLocation: "",
  });

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (user) {
      const updatedUser = {
        ...user,
        userGroceryList: user.userGroceryList.concat(inputValues),
      };
      userService.updateUser(user.id, updatedUser);
      window.location.reload();
    }

    setInputValues({ name: "", amount: "", groceryStoreLocation: "" });
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
            setInputValues({ ...inputValues, name: e.target.value })
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
            groceryStoreLocation: e.target.value,
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
