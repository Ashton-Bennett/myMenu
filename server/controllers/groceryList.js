const groceryListRouter = require("express").Router();
const User = require("../models/user");
const logger = require("../utils/logger");

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

module.exports = groceryListRouter;
