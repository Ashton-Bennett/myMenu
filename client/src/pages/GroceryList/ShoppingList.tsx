import BackButton from "../../components/BackButton";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import menuService from "../../services/menus";
import {
  Ingredient,
  Menu,
  Recipe,
  User,
  isHeading,
  IngredientVisibilityState,
} from "../../types";
import addGroceryListIdAndRecipeRefToIngredient from "../../utils/ingredientShoppingLocation";
import combineIngredientAmounts, {
  ingredientLookupMetric,
  ingredientLookupUnmeasurable,
} from "../../utils/combineIngredientAmounts";
import userServices from "../../services/user";
import { sortByName } from "../../utils/sortByName";

interface componentProps {
  setUser: Function;
  user?: User;
  updatedUserWithSocket: Function;
}
const ShoppingList = ({
  setUser,
  user,
  updatedUserWithSocket,
}: componentProps) => {
  const [menu, setMenu] = useState<Menu>();
  const { id } = useParams();
  const [list, setList] = useState<Ingredient[]>([]);
  const navigate = useNavigate();
  const [showRecipeRef, setShowRecipeRef] = useState<IngredientVisibilityState>(
    {}
  );

  useEffect(() => {
    if (user) {
      menuService.getSingleMenu(id).then((response) => {
        setMenu(response);
        let recipesOnMenu = response.items.filter((item: Recipe) => {
          return item.checked !== true;
        });

        recipesOnMenu = recipesOnMenu.map((recipe: Recipe) => {
          let ingredientsNotToIncludeIds =
            user?.userStapleIngredients.itemsToNeverAdd.map((ingredient) => {
              return ingredient.id;
            });
          ingredientsNotToIncludeIds = [
            ...ingredientsNotToIncludeIds,
            "64cc05a3a72c0a3d1db099b7",
          ];

          return recipe.ingredients.map((ingredient) => {
            if (
              isHeading(ingredient) ||
              ingredientsNotToIncludeIds.includes(ingredient.id)
            ) {
              return undefined;
            } else {
              return addGroceryListIdAndRecipeRefToIngredient(
                ingredient,
                recipe.name
              );
            }
          });
        });

        const sortedList = recipesOnMenu
          .flat()
          .filter((ingredient: Ingredient) => ingredient !== undefined)
          .sort(sortByName);
        setList(sortedList);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleStrikeThrough = (id: string) => {
    const ingredientToCheck = list.filter(
      (item) => item.groceryListId === id
    )[0];
    ingredientToCheck.checked = !ingredientToCheck.checked;
    const newList = list.filter((item) => item.groceryListId !== id);
    setList([...newList, ingredientToCheck]);
  };

  const handleAddToGroceryList = () => {
    var ingredientsThatAreNotCheckedOff = list.filter((ingredient) => {
      return !ingredient.checked && ingredient !== undefined;
    });

    var arrayOfUnmeasurableIngredients = [];
    var arrayOfAllMeasurableIngredients = [];

    for (let i = 0; i < ingredientsThatAreNotCheckedOff.length; i++) {
      if (
        ingredientsThatAreNotCheckedOff[i] !== undefined &&
        ingredientsThatAreNotCheckedOff[i].unitOfMeasure !== undefined &&
        // @ts-ignore
        ingredientsThatAreNotCheckedOff[i].unitOfMeasure in
          ingredientLookupUnmeasurable
      ) {
        arrayOfUnmeasurableIngredients.push(ingredientsThatAreNotCheckedOff[i]);
      } else {
        arrayOfAllMeasurableIngredients.push(
          ingredientsThatAreNotCheckedOff[i]
        );
      }
    }

    const combineArray1 = combineIngredientAmounts(
      arrayOfUnmeasurableIngredients
    );
    let combineArray2 = combineIngredientAmounts(
      arrayOfAllMeasurableIngredients
    );

    // round the ingredient amount
    combineArray2 = combineArray2.map((ingredient) => {
      if (ingredient.amount && ingredient.unitOfMeasure) {
        if (ingredient.unitOfMeasure in ingredientLookupMetric) {
          return {
            ...ingredient,
            amount: Number(Number(ingredient.amount).toFixed(2)),
          };
        }

        const roundedNumber =
          Number(ingredient.amount) > 2
            ? Math.ceil(Number(ingredient.amount))
            : Number(Number(ingredient.amount).toFixed(2));

        return { ...ingredient, amount: roundedNumber };
      } else {
        return ingredient;
      }
    });

    ingredientsThatAreNotCheckedOff = [...combineArray1, ...combineArray2];

    if (user && ingredientsThatAreNotCheckedOff) {
      setUser((prev: any) => {
        return {
          ...prev,
          userGroceryList: prev.userGroceryList.concat(
            ingredientsThatAreNotCheckedOff
          ),
        };
      });

      const updatedUser = {
        ...user,
        userGroceryList: user.userGroceryList.concat(
          ingredientsThatAreNotCheckedOff
        ),
      };
      userServices.updateUser(user.id, updatedUser);
      updatedUserWithSocket(updatedUser);
    }
    navigate("/myGroceryList");
  };

  const toggleIngredientsRecipeName = (ingredientGroceryListId: string) => {
    setShowRecipeRef((prevState) => ({
      ...prevState,
      [ingredientGroceryListId]: !prevState[ingredientGroceryListId],
    }));
  };
  console.log(showRecipeRef);
  return (
    <>
      <h1>Shopping List for {menu?.name}:</h1>
      <ul>
        {list.length > 0 &&
          list.map((ingredient, i) => {
            return ingredient.name ? (
              <li
                key={ingredient.groceryListId}
                id={ingredient.groceryListId}
                style={{
                  textDecoration: ingredient.checked ? "line-through" : "none",
                  marginBottom: "8px",
                }}
              >
                {ingredient.name} - {ingredient.amount}{" "}
                {ingredient.unitOfMeasure}
                <span>
                  <button
                    onClick={() =>
                      ingredient.groceryListId &&
                      toggleStrikeThrough(ingredient.groceryListId)
                    }
                  >
                    check-off
                  </button>
                </span>
                <span>
                  <button
                    style={{ marginLeft: "8px" }}
                    onClick={() =>
                      toggleIngredientsRecipeName(
                        ingredient.groceryListId ?? ""
                      )
                    }
                  >
                    used in
                  </button>
                </span>
                <span
                  style={{
                    display: showRecipeRef[ingredient.groceryListId ?? ""]
                      ? "flex"
                      : "none",
                  }}
                >
                  {ingredient.recipeRef}
                </span>
              </li>
            ) : null;
          })}
      </ul>
      <br></br>
      <button onClick={handleAddToGroceryList}>
        Add unchecked items to grocery list
      </button>
      <br></br>
      <br></br>
      <BackButton linkTo={undefined} />
    </>
  );
};

export default ShoppingList;
