import { InputFieldProps } from "../../types";

const InputField = ({
  type,
  label,
  newRecipe,
  setNewRecipe,
  name,
  value,
}: InputFieldProps) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewRecipe({
      ...newRecipe,
      [event.target.name]: event.target.value,
    });
  };
  return (
    <section>
      <label htmlFor={label}>{label}</label>
      <input
        value={value}
        type={type}
        name={name}
        onChange={handleInputChange}
      />
    </section>
  );
};

export default InputField;
