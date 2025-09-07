import { useState, useEffect } from "react";
import { User } from "../../types";
import userService from "../../services/user";
import { AxiosError } from "axios";

const initialFormState = {
  name: "",
  email: "",
};

interface userEditFormProps {
  user?: User | null;
}

const UserEditForm = ({ user }: userEditFormProps) => {
  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
      });
    } else {
      setForm(initialFormState);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let updatedUser = { ...user, ...form };
      const response = await userService.updateUser(
        updatedUser.id,
        updatedUser as User
      );

      if (response) {
        window.history.back();
      }
    } catch (err) {
      const axiosErr = err as AxiosError<{ error: string }>;
      setError(axiosErr.response?.data?.error || "Error updating user");
    }
  };

  const onCancel = () => {
    window.history.back();
  };

  const resetPassword = async () => {
    try {
      const response = await userService.resetUserPassword(user?.id);

      if (response) {
        setError("Password reset.");
      }
    } catch (err) {
      const axiosErr = err as AxiosError<{ error: string }>;
      setError(axiosErr.response?.data?.error || "Error resetting password");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{user ? "Edit User" : "Create User"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>Name:</label>
        <input name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Email:</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Update</button>
      <button type="button" onClick={resetPassword}>
        Reset Password
      </button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default UserEditForm;
