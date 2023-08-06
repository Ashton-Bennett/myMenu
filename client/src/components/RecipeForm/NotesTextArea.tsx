import { Recipe } from "../../types";

interface ComponentProps {
  setNewRecipe: Function;
  newRecipe: Recipe;
}

const NotesTextArea = ({ setNewRecipe, newRecipe }: ComponentProps) => {
  return (
    <>
      <label htmlFor="notes">Notes:</label>
      <br></br>
      <textarea
        id="notes"
        value={newRecipe.notes}
        onChange={(e) =>
          setNewRecipe((prev: Recipe) => ({ ...prev, notes: e.target.value }))
        }
      />
    </>
  );
};

export default NotesTextArea;
