import { SetStateAction, useState } from "react";
import { Recipe, Heading } from "../../types";

interface ComponentProps {
  i: number;
  setNewRecipe: Function;
  newRecipe: Recipe;
  isUpdateInput?: boolean;
  value?: Heading;
}

const HeadingInput = ({
  i,
  setNewRecipe,
  newRecipe,
  isUpdateInput,
  value,
}: ComponentProps) => {
  const [heading, setHeading] = useState<Heading>(
    value
      ? {
          id: value.id,
          heading: true,
          text: value.text,
        }
      : {
          id: "",
          heading: true,
          text: "",
        }
  );

  const handleHeadingChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    const newText = event.target.value as string;
    setHeading((prevHeading) => ({ ...prevHeading, text: newText }));
    setNewRecipe((prevRecipe: Recipe) => {
      const copy = [...prevRecipe.ingredients];
      copy[i] = { ...copy[i], text: newText };
      return { ...prevRecipe, ingredients: copy };
    });
  };

  //   const handleHeadingChange = (event: {
  //     target: { value: SetStateAction<string> };
  //   }) => {
  //     setHeading({ ...heading, text: event.target.value as string });
  //   };

  //   useEffect(() => {
  //     if (heading.text.length > 1) {
  //       const copy = [...newRecipe.ingredients];
  //       copy[i] = heading;
  //       setNewRecipe({ ...newRecipe, ingredients: copy });
  //     }
  //   }, [heading]);

  const handleDeleteIngredient = (i: number) => {
    const updatedIngredientsArray = newRecipe.ingredients.filter(
      (_, index) => index !== i
    );
    setNewRecipe((prev: Recipe) => ({
      ...prev,
      ingredients: updatedIngredientsArray,
    }));
  };
  <>
    <label>Heading:</label>
    <input type="text" />
  </>;

  return (
    <>
      <label htmlFor={value?.id}>
        Heading:
        <input
          name="heading"
          id={value?.id}
          data-testid={value?.id}
          type="text"
          value={heading.text}
          onChange={handleHeadingChange}
        />
      </label>
      <button onClick={() => handleDeleteIngredient(i)} type="button">
        delete heading
      </button>
    </>
  );
};

export default HeadingInput;
