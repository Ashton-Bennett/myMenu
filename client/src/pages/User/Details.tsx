import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserEditForm from "../../components/User/UserEditForm";
import userService from "../../services/user"; // adjust path to your service

const Details = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!userId);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userId) {
      (async () => {
        try {
          const fetchedUser = await userService.getSingleUser(userId);
          setUser(fetchedUser);
        } catch (err) {
          console.error(err);
          setError("Failed to load user");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [userId]);

  if (loading) return <p>Loading user...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <UserEditForm user={user} />
    </>
  );
};

export default Details;
