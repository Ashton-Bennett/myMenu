const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  items: Array,
  isPublic: Boolean,
  createdById: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

menuSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Menu", menuSchema);
