import { useState } from "react";
import menuService from "../../services/menus";
import { useNavigate } from "react-router-dom";
import { User } from "../../types";

interface componentProps {
  typeOfMenu: "public" | "private";
  user: User;
}

const AddNewmenuForm = ({ typeOfMenu, user }: componentProps) => {
  const [newMenuName, setNewMenuName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    menuService.addMenu(
      newMenuName,
      user.id,
      typeOfMenu === "public" ? true : false
    );
    navigate(typeOfMenu === "public" ? "/menus" : "/myMenus");
  };

  return (
    <>
      <h1>What would you like your Menu to be called?</h1>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          required
          onChange={(e) => setNewMenuName(e.target.value)}
          type="text"
        ></input>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default AddNewmenuForm;
