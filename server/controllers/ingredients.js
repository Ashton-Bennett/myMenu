const ingredientRouter = require("express").Router();
const Ingredient = require("../models/ingredient");
const logger = require("../utils/logger");

ingredientRouter.get("/", (request, response, next) => {
  Ingredient.find({})
    .then((ingredients) => {
      response.json(ingredients);
    })
    .catch((error) => next(error));
});

ingredientRouter.get("/:id", (request, response, next) => {
  const id = request.params.id;
  Ingredient.findById(id)
    .then((ingredient) => {
      ingredient ? response.json(ingredient) : response.status(404).end();
    })
    .catch((error) => next(error));
});

ingredientRouter.delete("/:id", (request, response, next) => {
  const id = request.params.id;
  Ingredient.findByIdAndDelete(id)
    .then((result) => {
      logger.info(`${result.name} ingredient was deleted `);
      response.status(204).end();
    })
    .catch((error) => next(error));
});

ingredientRouter.post("/", (request, response, next) => {
  const ingredient = request.body;
  const newIngredient = new Ingredient(ingredient);

  newIngredient
    .save()
    .then((savedIngredient) => {
      response.json(savedIngredient);
      logger.info(`-> ADDED ${ingredient.name} ingredient`);
    })
    .catch((error) => next(error));
});

ingredientRouter.put("/:id", (request, response, next) => {
  const updatedIngredient = request.body;
  const id = request.params.id;

  Ingredient.findByIdAndUpdate(id, updatedIngredient, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

module.exports = ingredientRouter;
