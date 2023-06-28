import { Recipe } from "../../types";
import Autocomplete from "react-google-autocomplete";

interface propTypes {
  newRecipe: Recipe;
  setNewRecipe: Function;
  value: string;
}

const CountryInput = ({ setNewRecipe, newRecipe, value }: propTypes) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewRecipe({
      ...newRecipe,
      country: event.target.value,
    });
  };
  return (
    <>
      <label htmlFor="country input"> Country of Origin </label>
      <Autocomplete
        id="country input"
        apiKey={process.env.REACT_APP_GOOGLE_TOKEN}
        options={{
          types: ["country"],
        }}
        onPlaceSelected={(place) => {
          setNewRecipe((prev: Recipe) => ({
            ...prev,
            country: place?.formatted_address,
          }));
        }}
        inputAutocompleteValue={value}
        onChange={handleInputChange}
      />
    </>
  );
};

export default CountryInput;
