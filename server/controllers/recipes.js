const recipeRouter = require("express").Router();
const Recipe = require("../models/recipe");
const path = require("path");
const logger = require("../utils/logger");

recipeRouter.get("/", (request, response, next) => {
  Recipe.find({})
    .then((recipes) => {
      response.json(recipes);
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

recipeRouter.delete("/:id", (request, response, next) => {
  const id = request.params.id;
  Recipe.findByIdAndDelete(id)
    .then((result) => {
      logger.info(`${result.name} recipe was deleted `);
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

// For when the client refreshes the page
recipeRouter.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

module.exports = recipeRouter;
