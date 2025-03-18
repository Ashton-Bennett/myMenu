const recipeRouter = require("express").Router();
const Recipe = require("../models/recipe");
const logger = require("../utils/logger");
const recipeFormat = require("../utils/openAi");
const oracleService = require("../utils/oracleService.js");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const sharp = require("sharp");

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
      if (result.imgName?.length > 0) {
        const deleteObjectRequest = {
          bucketName: "TheMenuAppRecipeImgs",
          objectName: result.imgName,
        };
        oracleService.deleteImageInOracleCloud(deleteObjectRequest);
      }
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "tempUploads/");
  },
});

const upload = multer({ storage: storage });

recipeRouter.post(
  "/",
  upload.single("file"),
  async (request, response, next) => {
    const recipe = JSON.parse(request.body.newRecipe);
    let newRecipe = new Recipe(recipe);

    let imgId = null;

    if (request.file) {
      logger.info("Recipe did include image.");
      imgId = uuidv4();
      newRecipe.imgName = `${newRecipe.name}_${imgId}`;
      const originalPath = request.file.path;

      try {
        // Resize the image using Sharp
        await sharp(originalPath)
          .resize({ width: 600, withoutEnlargement: true }) // Resize if larger
          .webp({ quality: 100, lossless: true })
          .toFile(`tempUploads/resized_${imgId}.webp`);
      } catch (sharpError) {
        logger.error("Error resizing image:", sharpError);
        return next(sharpError);
      }
    } else {
      logger.info("Recipe did NOT include image.");
    }

    // Save the recipe to the database
    newRecipe
      .save()
      .then((savedRecipe) => {
        response.json(savedRecipe);
        logger.info(`-> ADDED ${newRecipe.name} ${newRecipe.imgName} recipe`);

        if (imgId) {
          const imageRequest = {
            fileLocation: `tempUploads/resized_${imgId}.webp`,
            objectName: newRecipe.imgName,
            bucketName: "TheMenuAppRecipeImgs",
          };

          oracleService
            .putImageInOracleCloud(imageRequest)
            .then(() => {
              // Delete the original and resized image files
              Promise.all([
                fs.promises.unlink(request.file.path), // Deleting the original image
                fs.promises.unlink(`tempUploads/resized_${imgId}.webp`),
              ])
                .then(() => {
                  logger.info("Temporary image files deleted successfully.");
                })
                .catch((err) => {
                  console.error("Error deleting image files:", err);
                });
            })
            .catch((oracleError) => {
              console.error("Oracle Cloud Upload Failed:", oracleError);
            });
        }
      })
      .catch((error) => next(error));
  }
);

recipeRouter.put(
  "/:id",
  upload.single("file"),
  async (request, response, next) => {
    const updatedRecipe = JSON.parse(request.body.updatedRecipe);
    let imgId = null;
    let resizedImagePath = null;
    let originalPath = request.file?.path; // Ensure it's safely accessed

    if (request.file) {
      logger.info("Recipe did include image.");
      if (!updatedRecipe.imgName) {
        imgId = uuidv4();
        updatedRecipe.imgName = `${updatedRecipe.name}_${imgId}`;
      } else {
        imgId = updatedRecipe.imgName.split("_").pop();
      }

      resizedImagePath = `tempUploads/resized_${imgId}.jpeg`;

      try {
        // Resize the image using Sharp
        await sharp(originalPath)
          .resize({ width: 600, withoutEnlargement: true })
          .webp({ quality: 100, lossless: true })
          .toFile(resizedImagePath);
      } catch (sharpError) {
        logger.error("Error resizing image:", sharpError);
        return next(sharpError);
      }
    } else {
      logger.info("Recipe did NOT include image.");
    }

    const id = request.params.id;

    Recipe.findByIdAndUpdate(id, updatedRecipe, {
      new: true,
      runValidators: true,
      context: "query",
    })
      .then((updatedRecipe) => {
        if (imgId) {
          const imageRequest = {
            fileLocation: resizedImagePath,
            objectName: updatedRecipe.imgName,
            bucketName: "TheMenuAppRecipeImgs",
          };

          return oracleService.putImageInOracleCloud(imageRequest);
        }
      })
      .then(() => {
        // Cleanup: Delete the uploaded files
        const deletePromises = [];

        if (originalPath) {
          deletePromises.push(
            fs.promises.unlink(originalPath).catch((err) => {
              console.error("Error deleting original file:", err);
            })
          );
        }

        if (resizedImagePath) {
          deletePromises.push(
            fs.promises.unlink(resizedImagePath).catch((err) => {
              console.error("Error deleting resized file:", err);
            })
          );
        }

        return Promise.all(deletePromises);
      })
      .then(() => {
        logger.info("Temporary image files deleted successfully.");
        response.json(updatedRecipe);
      })
      .catch((error) => {
        logger.error("Error during update process:", error);
        next(error);
      });
  }
);

module.exports = recipeRouter;
