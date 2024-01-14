const groceryListRouter = require("express").Router();
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");

groceryListRouter.get("/:id", (request, response, next) => {
  const id = request.params.id;
  User.findById(id)
    .then((user) => {
      user ? response.json(user.userGroceryList) : response.status(404).end();
    })
    .catch((error) => next(error));
});

//doesn't delete the list, just clears the contents
groceryListRouter.delete("/:id", (request, response, next) => {
  const id = request.params.id;

  User.findById(id)
    .then((user) => {
      if (user) {
        user.userGroceryList = [];
        User.findByIdAndUpdate(id, user, {
          new: true,
          runValidators: true,
          context: "query",
        })
          .then((updatedNote) => {
            response.json(updatedNote);
          })
          .catch((error) => next(error));
      } else {
        console.log("Can't find user, won't clear groceryList");
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

groceryListRouter.put("/:id", (request, response, next) => {
  const id = request.params.id;

  const updatedList = request.body;

  User.findByIdAndUpdate(id, updatedList, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

groceryListRouter.put("/addSingleItem/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const newItemName = request.body.ingredient;
    const formattedNewItem = {
      name: newItemName,
      alias: [newItemName],
      pairings: [],
      season: [],
      amount: "",
      groceryListId: uuidv4(),
      groceryStoreLocation: "unknown",
    };

    const user = await User.findById(id);

    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    user.userGroceryList.push(formattedNewItem);

    const updatedUser = await user.save();
    response.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = groceryListRouter;
