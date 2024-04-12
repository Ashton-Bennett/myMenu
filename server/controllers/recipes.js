const recipeRouter = require("express").Router();
const Recipe = require("../models/recipe");
const logger = require("../utils/logger");
const recipeFormat = require("../utils/openAi");

recipeRouter.get("/", (request, response, next) => {
  Recipe.find({
    $or: [{ isMenuDuplicate: false }, { isMenuDuplicate: { $exists: false } }],
  })
    .then((recipes) => {
      response.json(recipes);
    })
    .catch((error) => next(error));
});

recipeRouter.get("/recipe-upload", (request, response, next) => {
  const recipe = request.query.recipe;
  recipeFormat(recipe)
    .then((completion) => {
      completion ? response.json(completion) : response.status(404).end();
    })
    .catch((error) => next(error));
});

recipeRouter.get("/:id", (request, response, next) => {
  const id = request.params.id;
  Recipe.findById(id)
    .then((recipe) => {
      recipe ? response.json(recipe) : response.status(404).end();
    })
    .catch((error) => next(error));
});

recipeRouter.get("/viewMenuRecipe/:id", (request, response, next) => {
  const id = request.params.id;
  Recipe.find({ menuItemId: id })
    .then((recipe) => {
      recipe ? response.json(recipe) : response.status(404).end();
    })
    .catch((error) => next(error));
});

recipeRouter.delete("/:id", (request, response, next) => {
  const id = request.params.id;
  Recipe.findByIdAndDelete(id)
    .then((result) => {
      logger.info(`${result?.name} recipe was deleted `);
      response.status(204).end();
    })
    .catch((error) => next(error));
});

recipeRouter.post("/", (request, response, next) => {
  const recipe = request.body;
  const newRecipe = new Recipe(recipe);

  newRecipe
    .save()
    .then((savedRecipe) => {
      response.json(savedRecipe);
      logger.info(`-> ADDED ${recipe.name} recipe`);
    })
    .catch((error) => next(error));
});

recipeRouter.put("/:id", (request, response, next) => {
  const updatedRecipe = request.body;
  const id = request.params.id;

  Recipe.findByIdAndUpdate(id, updatedRecipe, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

module.exports = recipeRouter;
