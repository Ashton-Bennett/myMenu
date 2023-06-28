import { useNavigate } from "react-router-dom";

type propTypes = {
  linkTo: string | undefined;
};

const BackButton = ({ linkTo }: propTypes) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (!linkTo) {
      return navigate(-1);
    }
    navigate(linkTo);
  };
  return (
    <button type="button" onClick={handleClick}>
      Back
    </button>
  );
};

export default BackButton;
