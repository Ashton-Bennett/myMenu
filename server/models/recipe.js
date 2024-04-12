const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
  },
  ingredients: Array,
  directions: Array,
  category: String,
  country: String,
  prepTime: String,
  cookTime: String,
  region: String,
  servings: String,
  story: String,
  drinkPairings: String,
  checked: Boolean,
  notes: String,
  isMenuDuplicate: Boolean,
  menuItemId: String,
});

recipeSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// const Recipe = mongoose.model("Recipe", recipeSchema);

// const recipe = new Recipe({
//   name: "roasted chicken",
//   ingredients: ["chicken", "salt", "oil"],
//   directions: ["rub chicken with salt and oil", "bake at 400 until 165 F"],
// });

// recipe.save().then((result) => {
//   console.log("recipe saved!");
//   mongoose.connection.close();
// });

// Recipe.find({ name: "Cookies" }).then((result) => {
//   result.forEach((note) => {
//     console.log(note);
//   });
//   mongoose.connection.close();
// });

module.exports = mongoose.model("Recipe", recipeSchema);
