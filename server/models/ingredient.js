const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  alias: Array,
  groceryStoreLocation: String,
  groceryListId: String,
  checked: Boolean,
  amount: Number,
  unitOfMeasure: String,
  dataBaseId: String,
  pairings: Array,
  season: Array,
});

ingredientSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Ingredient", ingredientSchema);
