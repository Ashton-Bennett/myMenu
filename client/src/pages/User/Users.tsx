import { useEffect, useState } from "react";
import userService from "../../services/user";
import { User } from "../../types";
import { Link } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    userService.getAll().then((response) => {
      if (response) {
        setUsers(response);
      }
    });
  }, []);

  const handleDelete = async (userId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return; // cancel deletion if user clicks "Cancel"
    }

    try {
      const response = await userService.deleteUser(userId);
      if (response) {
        setUsers(users.filter((user) => user.id !== userId));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div>
      <h1>Users Page</h1>
      {users.length === 0 ? (
        <p>Loading...</p>
      ) : (
        users.map((user) => (
          <article
            key={user.id}
            style={{
              border: "1px solid black",
              margin: "1rem",
              padding: "1rem",
            }}
          >
            <h2>{user.name}</h2>
            <p>Email: {user.email}</p>
            <p>
              <Link to={`/viewrecipes`}>User Recipes</Link>
            </p>
            <p>
              <Link to={`/mymenus`}>User Menus</Link>
            </p>
            <p>
              <Link to={`/myGroceryList/`}>User Grocery List</Link>
            </p>
            <p>
              <Link to={`/ingredients/`}>User Staple Ingredients</Link>
            </p>
            <Link to={`/users/userDetails/${user.id}`}>
              <button>Edit User</button>
            </Link>

            <button onClick={() => handleDelete(user.id)}>Delete User</button>
          </article>
        ))
      )}
    </div>
  );
};

export default Users;
