import { useEffect, useState } from "react";
import { Ingredient, Season } from "../../types";

interface componentProps {
  setNewIngredient: React.Dispatch<React.SetStateAction<Ingredient>>;
  newIngredient: Ingredient;
}

const SeasonInput = ({ newIngredient, setNewIngredient }: componentProps) => {
  const [season, setSeason] = useState<Season[]>(
    newIngredient.season[0] ? newIngredient.season : []
  );

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    if (checked) {
      setSeason((prev: Season[]) => [...prev, value as Season]);
    } else {
      setSeason((prev: Season[]) => prev.filter((s) => s !== value));
    }
  };

  useEffect(() => {
    setNewIngredient((prev: Ingredient) => ({
      ...prev,
      season: season,
    }));
  }, [season]);

  return (
    <>
      <h3>Season:</h3>
      <label htmlFor="Spring">
        <input
          id="Spring"
          type="checkbox"
          name="Spring"
          value="Spring"
          checked={season.includes("Spring")}
          onChange={handleCheckboxChange}
        />
        Spring
      </label>
      <label htmlFor="Summer">
        <input
          id="Summer"
          type="checkbox"
          name="Summer"
          value="Summer"
          checked={season.includes("Summer")}
          onChange={handleCheckboxChange}
        />
        Summer
      </label>

      <label htmlFor="Fall">
        <input
          id="Fall"
          type="checkbox"
          name="Fall"
          value="Fall"
          checked={season.includes("Fall")}
          onChange={handleCheckboxChange}
        />
        Fall
      </label>
      <label htmlFor="Winter">
        <input
          id="Winter"
          type="checkbox"
          name="Winter"
          value="Winter"
          checked={season.includes("Winter")}
          onChange={handleCheckboxChange}
        />
        Winter
      </label>
      <label htmlFor="Year Round">
        <input
          id="Year Round"
          type="checkbox"
          name="Year Round"
          value="Year Round"
          checked={season.includes("Year Round")}
          onChange={handleCheckboxChange}
        />
        Year Round
      </label>
      <br></br>
    </>
  );
};

export default SeasonInput;
