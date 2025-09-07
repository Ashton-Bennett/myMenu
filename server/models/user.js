const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
  alexaToken: {
    type: String,
  },
  userRecipes: Array,
  userGroceryList: Array,
  userMenus: Array,
  userStapleIngredients: {
    itemsToNeverAdd: Array,
    quickAddItems: Array,
  },
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
    delete returnedObject.refreshToken;
  },
});

module.exports = mongoose.model("User", userSchema);
