import { Ingredient } from "../types";

interface IngredientLookup {
  [key: string]: number;
}

export const ingredientLookupUnmeasurable: IngredientLookup = {
  each: 1,
  "to taste": 1,
  "to garnish": 1,
};

//Converts to oz
const ingredientLookupImperial: IngredientLookup = {
  "pinch(s)": 12,
  "teaspoon(s)": 6,
  "Tablespoon(s)": 2,
  "oz(s)": 1,
  "Cup(s)": 8,
  "pint(s)": 16,
  "Pound(s)": 16,
  "quart(s)": 32,
  "gallon(s)": 128,
};

export const ingredientLookupMetric: IngredientLookup = {
  "g(s)": 1,
  milliliters: 1,
  "Kg(s)": 1000,
  "Liter(s)": 1000,
};

//converts to oz
const ingredientLookupMetricToImperial: IngredientLookup = {
  "g(s)": 0.035,
  milliliters: 0.033,
  "Kg(s)": 35.27,
  "Liter(s)": 33.81,
};

interface IngredientLookUp {
  unitOfMeasure: string;
  amount: number;
}

const combineMetricAndImperial = (
  ingredients: IngredientLookUp[]
): IngredientLookUp => {
  const convertAmount = (ingredient: IngredientLookUp): number => {
    const lookupTable =
      ingredient.unitOfMeasure in ingredientLookupMetricToImperial
        ? ingredientLookupMetricToImperial
        : ingredientLookupImperial;

    if (
      ["Tablespoon(s)", "teaspoon(s)", "pinch(s)"].includes(
        ingredient.unitOfMeasure
      )
    ) {
      return (
        ingredient.amount / ingredientLookupImperial[ingredient.unitOfMeasure]
      );
    } else {
      return ingredient.amount * lookupTable[ingredient.unitOfMeasure];
    }
  };

  const firstAmount = convertAmount(ingredients[0]);
  const secondAmount = convertAmount(ingredients[1]);

  const combinedAmount = firstAmount + secondAmount;

  return {
    amount: combinedAmount,
    unitOfMeasure: "oz(s)",
  };
};

const combineMetricMeasurements = (
  ingredients: IngredientLookUp[]
): IngredientLookUp => {
  const firstAmount =
    ingredients[0].amount *
    ingredientLookupMetric[ingredients[0].unitOfMeasure];
  const secondAmount =
    ingredients[1].amount *
    ingredientLookupMetric[ingredients[1].unitOfMeasure];

  const combinedAmount = firstAmount + secondAmount;
  let combinedAmountObj: IngredientLookUp = { amount: 0, unitOfMeasure: "" };
  if (
    ingredients[0].unitOfMeasure === "g(s)" ||
    ingredients[0].unitOfMeasure === "Kg(s)"
  ) {
    if (combinedAmount >= 1000) {
      combinedAmountObj = {
        amount: combinedAmount / 1000,
        unitOfMeasure: "Kg(s)",
      };
    } else {
      combinedAmountObj = { amount: combinedAmount, unitOfMeasure: "g(s)" };
    }
  }

  if (
    ingredients[0].unitOfMeasure === "milliliters" ||
    ingredients[0].unitOfMeasure === "Liter(s)"
  ) {
    if (combinedAmount >= 1000) {
      combinedAmountObj = {
        amount: combinedAmount / 1000,
        unitOfMeasure: "Liter(s)",
      };
    } else {
      combinedAmountObj = {
        amount: combinedAmount,
        unitOfMeasure: "milliliters",
      };
    }
  }
  return combinedAmountObj;
};

const combineImperialMeasurementsAndConvertToOz = (
  ingredients: IngredientLookUp[]
): IngredientLookUp => {
  let totalAmountInOz = 0;

  ingredients.forEach((ingredient) => {
    let amountToAdd = 0;
    if (
      ["Tablespoon(s)", "teaspoon(s)", "pinch(s)"].includes(
        ingredient.unitOfMeasure
      )
    ) {
      amountToAdd =
        ingredient.amount / ingredientLookupImperial[ingredient.unitOfMeasure];
    } else {
      amountToAdd =
        ingredient.amount * ingredientLookupImperial[ingredient.unitOfMeasure];
    }
    totalAmountInOz += amountToAdd;
  });

  return {
    amount: totalAmountInOz,
    unitOfMeasure: "oz(s)",
  };
};

const combineIngredientAmounts = (ingredients: Ingredient[]): Ingredient[] => {
  return ingredients.reduce((acc: Ingredient[], ingredient) => {
    let matchingIngredient = acc.find(
      (item: Ingredient) => item.id === ingredient.id
    );
    if (matchingIngredient) {
      if (ingredient.unitOfMeasure === matchingIngredient.unitOfMeasure) {
        //combine the ingredient amounts
        matchingIngredient.amount =
          Number(matchingIngredient.amount) + Number(ingredient.amount);
        //join the recipe refs array
        matchingIngredient.recipeRef = matchingIngredient.recipeRef
          ? matchingIngredient.recipeRef.concat(ingredient.recipeRef || "")
          : ingredient.recipeRef || [];
        return acc;
      }

      if (
        matchingIngredient.unitOfMeasure !== undefined &&
        ingredient.unitOfMeasure !== undefined &&
        (ingredient.unitOfMeasure in ingredientLookupImperial ||
          ingredient.unitOfMeasure in ingredientLookupMetric) &&
        (matchingIngredient.unitOfMeasure in ingredientLookupImperial ||
          matchingIngredient.unitOfMeasure in ingredientLookupMetric)
      ) {
        if (
          ingredient.unitOfMeasure in ingredientLookupImperial &&
          matchingIngredient.unitOfMeasure in ingredientLookupImperial
        ) {
          const newAmountInOz = combineImperialMeasurementsAndConvertToOz([
            {
              unitOfMeasure: matchingIngredient.unitOfMeasure,
              amount:
                typeof matchingIngredient.amount === "number"
                  ? matchingIngredient.amount
                  : parseFloat(matchingIngredient.amount || ""),
            },
            {
              unitOfMeasure: ingredient.unitOfMeasure,
              amount:
                typeof ingredient.amount === "number"
                  ? ingredient.amount
                  : parseFloat(ingredient.amount || ""),
            },
          ]);
          matchingIngredient.amount = newAmountInOz.amount;
          matchingIngredient.unitOfMeasure = newAmountInOz.unitOfMeasure;
          //join the recipe refs array
          matchingIngredient.recipeRef = matchingIngredient.recipeRef
            ? matchingIngredient.recipeRef.concat(ingredient.recipeRef || "")
            : ingredient.recipeRef || [];
        }
        if (
          ingredient.unitOfMeasure in ingredientLookupMetric &&
          matchingIngredient.unitOfMeasure in ingredientLookupMetric
        ) {
          const newCombinedAmount = combineMetricMeasurements([
            {
              unitOfMeasure: matchingIngredient.unitOfMeasure,
              amount:
                typeof matchingIngredient.amount === "number"
                  ? matchingIngredient.amount
                  : parseFloat(matchingIngredient.amount || ""),
            },
            {
              unitOfMeasure: ingredient.unitOfMeasure,
              amount:
                typeof ingredient.amount === "number"
                  ? ingredient.amount
                  : parseFloat(ingredient.amount || ""),
            },
          ]);
          matchingIngredient.amount = newCombinedAmount.amount;
          matchingIngredient.unitOfMeasure = newCombinedAmount.unitOfMeasure;
          //join the recipe refs array
          matchingIngredient.recipeRef = matchingIngredient.recipeRef
            ? matchingIngredient.recipeRef.concat(ingredient.recipeRef || "")
            : ingredient.recipeRef || [];
        }
        if (
          ingredient.unitOfMeasure in ingredientLookupMetric &&
          matchingIngredient.unitOfMeasure in ingredientLookupImperial
        ) {
          const newCombinedAmount = combineMetricAndImperial([
            {
              unitOfMeasure: matchingIngredient.unitOfMeasure,
              amount:
                typeof matchingIngredient.amount === "number"
                  ? matchingIngredient.amount
                  : parseFloat(matchingIngredient.amount || ""),
            },
            {
              unitOfMeasure: ingredient.unitOfMeasure,
              amount:
                typeof ingredient.amount === "number"
                  ? ingredient.amount
                  : parseFloat(ingredient.amount || ""),
            },
          ]);
          matchingIngredient.amount = newCombinedAmount.amount;
          matchingIngredient.unitOfMeasure = newCombinedAmount.unitOfMeasure;
          //join the recipe refs array
          matchingIngredient.recipeRef = matchingIngredient.recipeRef
            ? matchingIngredient.recipeRef.concat(ingredient.recipeRef || "")
            : ingredient.recipeRef || [];
        }
        if (
          ingredient.unitOfMeasure in ingredientLookupImperial &&
          matchingIngredient.unitOfMeasure in ingredientLookupMetric
        ) {
          const newCombinedAmount = combineMetricAndImperial([
            {
              unitOfMeasure: matchingIngredient.unitOfMeasure,
              amount:
                typeof matchingIngredient.amount === "number"
                  ? matchingIngredient.amount
                  : parseFloat(matchingIngredient.amount || ""),
            },
            {
              unitOfMeasure: ingredient.unitOfMeasure,
              amount:
                typeof ingredient.amount === "number"
                  ? ingredient.amount
                  : parseFloat(ingredient.amount || ""),
            },
          ]);
          matchingIngredient.amount = newCombinedAmount.amount;
          matchingIngredient.unitOfMeasure = newCombinedAmount.unitOfMeasure;
          //join the recipe refs array
          matchingIngredient.recipeRef = matchingIngredient.recipeRef
            ? matchingIngredient.recipeRef.concat(ingredient.recipeRef || "")
            : ingredient.recipeRef || [];
        }
        if (
          ingredient.amount === undefined ||
          matchingIngredient.amount === undefined
        ) {
          acc.push({ ...ingredient });
        }
      } else {
        acc.push({ ...ingredient });
      }
    } else {
      acc.push({ ...ingredient });
    }
    return acc;
  }, []);
};
export default combineIngredientAmounts;
