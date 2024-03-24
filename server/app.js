const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const recipeRouter = require("./controllers/recipes");
const menuRouter = require("./controllers/menus");
const userRouter = require("./controllers/users");
const groceryListRouter = require("./controllers/groceryList");
const ingredientsRouter = require("./controllers/ingredients");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

logger.info("Attempting to connect to mongoDB");

mongoose
  .connect(config.MONGO_URL)
  .then((result) => {
    logger.info("SUCCESSFULLY connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

// app.use(cors());

if (config.IS_DEVELOPMENT) {
  logger.info("In DEV");
  app.use(cors());
} else {
  logger.info("In PROD");
  app.use(cors({ origin: "https://the-menu-by-ashton-bennett.fly.dev/" }));
}

app.use(express.static("build"));
app.use("/legal", express.static("public"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/recipes", recipeRouter);
app.use("/api/menus", menuRouter);
app.use("/api/user", userRouter);
app.use("/api/myGroceryList/", groceryListRouter);
app.use("/api/ingredients", ingredientsRouter);

//these are meant to be called last
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
