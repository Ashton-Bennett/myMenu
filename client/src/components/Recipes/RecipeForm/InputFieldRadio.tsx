import { InputFieldProps } from "../../../types";
const InputFieldRadio = ({
  type,
  label,
  newRecipe,
  setNewRecipe,
  name,
  value,
}: InputFieldProps) => {
  const handleInputChange = (event: any) => {
    setNewRecipe({
      ...newRecipe,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <>
      <br></br>
      <input
        id={label}
        type={type}
        name={name}
        onChange={handleInputChange}
        value={value}
        checked={newRecipe.category === value || newRecipe.region === value}
      />
      <label htmlFor={label}>{label}</label>
    </>
  );
};

export default InputFieldRadio;
