import { User } from "../../types";
import { useState, FormEvent } from "react";
import authService from "../../services/auth";
import userService from "../../services/user";
import { useNavigate } from "react-router-dom";

interface props {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

function CreateUser({ user, setUser }: props) {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const response = await userService.addUser(name, password, email);

    if (response.success && response.statusCode === 201) {
      const loginResponse = await authService.login(name, password);
      if (!loginResponse.success) {
        setError("User created but failed to log in");
        return;
      }
      const loadUser = await userService.getSingleUser(response.data.id);
      if (loadUser) {
        setUser(loadUser);
        navigate("/");
      } else {
        setError("User not found");
      }
    } else {
      setError(response.error);
    }
  };

  return (
    <div>
      <h1>Create Account</h1>

      <p> Yes Chef!? </p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <button type="submit">Create Account</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <div style={{ marginTop: "4rem" }}>
        <a href="/legal/terms-of-use.html" title="terms of use">
          Terms of use
        </a>
        <a
          style={{ padding: "1rem" }}
          href="/legal/privacy-policy.html"
          title="privacy policy"
        >
          Privacy Policy
        </a>
      </div>
    </div>
  );
}

export default CreateUser;
