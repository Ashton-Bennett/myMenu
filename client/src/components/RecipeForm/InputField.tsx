import { InputFieldProps } from "../../types";

const InputField = ({
  type,
  label,
  newRecipe,
  setNewRecipe,
  name,
  value,
  required,
}: InputFieldProps) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewRecipe({
      ...newRecipe,
      [event.target.name]: event.target.value,
    });
  };
  return (
    <>
      <label htmlFor={label}>{label}</label>
      <input
        id={label}
        value={value}
        type={type}
        name={name}
        onChange={handleInputChange}
        required={required}
      />
      <br></br>
    </>
  );
};

export default InputField;
