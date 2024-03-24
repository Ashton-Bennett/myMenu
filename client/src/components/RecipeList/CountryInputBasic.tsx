import { ChangeEventHandler, Fragment, useEffect, useState } from "react";
import { Recipe } from "../../types";
import axios from "axios";

interface propTypes {
  inputValue: string;
  setInputValue: Function;
  placeholder: string;
  changeHandler: ChangeEventHandler<HTMLInputElement>;
  name: string;
}

const CountryInputBasic = ({
  setInputValue,
  inputValue,
  placeholder,
  changeHandler,
  name,
}: propTypes) => {
  const [countryList, setCountryList] = useState([]);
  const [countriesToDisplay, setCountriesToDisplay] = useState<string[]>();
  const [clickedCountry, setClickedCountry] = useState(false);

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
    if (inputValue.length >= 1) {
      const filteredCountries = countryList?.filter(
        (countryFromList: string) => {
          return countryFromList
            .toLowerCase()
            .includes(inputValue.toLowerCase());
        }
      );

      setCountriesToDisplay(filteredCountries);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  useEffect(() => {
    if (clickedCountry) {
      setCountriesToDisplay([]);
      setClickedCountry(false);
    }
  }, [clickedCountry]);

  const handleItemClick = (item: string) => {
    setClickedCountry(true);
    setInputValue((prev: Recipe) => ({
      ...prev,
      countryInput: item,
    }));
  };

  return (
    <>
      <input
        placeholder={placeholder}
        id="country input"
        onChange={changeHandler}
        type="text"
        value={inputValue}
        name={name}
      />

      {inputValue && countriesToDisplay && (
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

export default CountryInputBasic;
