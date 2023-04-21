import { InputFieldProps } from "../../types";
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
    <section>
      <input
        id={label}
        type={type}
        name={name}
        onChange={handleInputChange}
        value={value}
      />
      <label htmlFor={label}>{label}</label>
    </section>
  );
};

export default InputFieldRadio;
