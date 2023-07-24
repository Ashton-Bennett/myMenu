const ingredientsRouter = require("../../../server/controllers/ingredients");

const addToIngredientDB = (ingredients) => {
  ingredients.forEach((ingredientObj) => ingredientsRouter.post(ingredientObj));
};
module.exports = addToIngredientDB;
