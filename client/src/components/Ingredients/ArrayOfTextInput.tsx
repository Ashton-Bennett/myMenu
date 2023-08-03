import { Ingredient } from "../../types";

interface componentProps {
  newIngredient: Ingredient;
  setNewIngredient: React.Dispatch<React.SetStateAction<Ingredient>>;
  value: "alias" | "pairings";
}

const ArrayOfTextInput = ({
  newIngredient,
  setNewIngredient,
  value,
}: componentProps) => {
  const handleAddValue = () => {
    setNewIngredient((prev: Ingredient) => ({
      ...prev,
      [value]: [...prev[value], ""],
    }));
  };

  const handleValueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    const copy = [...newIngredient[value]];
    copy[i] = event.target.value;
    setNewIngredient((prev: Ingredient) => ({ ...prev, [value]: copy }));
  };

  return (
    <>
      <h3>{value}:</h3>
      {newIngredient[value].map((val, i) => {
        return (
          <div key={`${value}-${i}`}>
            <label htmlFor={`${value}-${i}`}>{i + 1}</label>
            <input
              id={`${value}-${i}`}
              name={value}
              type="text"
              value={newIngredient[value][i]}
              onChange={(e) => handleValueChange(e, i)}
            />
          </div>
        );
      })}
      <button type="button" onClick={handleAddValue}>
        + {value}
      </button>
    </>
  );
};

export default ArrayOfTextInput;
