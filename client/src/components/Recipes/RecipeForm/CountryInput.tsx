import { Fragment, useEffect, useState } from "react";
import { Recipe } from "../../../types";
import axios from "axios";

interface propTypes {
  newRecipe: Recipe;
  setNewRecipe: Function;
}

const CountryInput = ({ setNewRecipe, newRecipe }: propTypes) => {
  const [countryList, setCountryList] = useState([]);
  const [countriesToDisplay, setCountriesToDisplay] = useState<string[]>();
  const [clickedCountry, setClickedCountry] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewRecipe({
      ...newRecipe,
      country: event.target.value,
    });
  };

  useEffect(() => {
    const getCountryList = async () => {
      try {
        const response = await axios.get(`https://restcountries.com/v3.1/all`);
        if (response) {
          const countryNamesArray = response.data.map(
            (country: { name: { common: string } }) => country.name.common
          );
          setCountryList(countryNamesArray);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getCountryList();
  }, []);

  useEffect(() => {
    if (newRecipe.country) {
      const filteredCountries = countryList?.filter(
        (countryFromList: string) => {
          return countryFromList
            .toLowerCase()
            .includes(newRecipe.country.toLowerCase());
        }
      );

      setCountriesToDisplay(filteredCountries);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newRecipe.country]);

  useEffect(() => {
    if (clickedCountry) {
      setCountriesToDisplay([]);
      setClickedCountry(false);
    }
  }, [clickedCountry]);

  const handleItemClick = (item: string) => {
    setClickedCountry(true);
    setNewRecipe((prev: Recipe) => ({
      ...prev,
      country: item,
    }));
  };

  return (
    <>
      <label htmlFor="country input"> Country of Origin </label>
      <input
        id="country input"
        onChange={handleInputChange}
        type="text"
        value={newRecipe.country}
      />

      {newRecipe.country && countriesToDisplay && (
        <ul>
          {countriesToDisplay?.map((item, i) => (
            <Fragment key={`${item} + ${i}`}>
              <li className="cursor" onClick={() => handleItemClick(item)}>
                {item} <span> </span>
              </li>
            </Fragment>
          ))}
        </ul>
      )}
    </>
  );
};

export default CountryInput;
