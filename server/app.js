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
const addToIngredientDB = require("../client/src/utils/databaseBuilder");
const deliIngredients = [
  {
    name: "ham",
    alias: ["chopped", "sliced", "diced", "black forest", "honey ham"],
    groceryStoreLocation: "deli",
    foodPairings: [
      "cheddar cheese",
      "swiss cheese",
      "honey mustard",
      "pineapple",
    ],
    season: "All year",
  },
  {
    name: "turkey",
    alias: [
      "chopped",
      "sliced",
      "diced",
      "smoked",
      "turkey breast",
      "cajun turkey",
    ],
    groceryStoreLocation: "deli",
    foodPairings: ["cranberry sauce", "avocado", "bacon", "lettuce"],
    season: "All year",
  },
  {
    name: "roast beef",
    alias: ["chopped", "sliced", "diced"],
    groceryStoreLocation: "deli",
    foodPairings: [
      "horseradish sauce",
      "caramelized onions",
      "swiss cheese",
      "arugula",
    ],
    season: "All year",
  },
  {
    name: "salami",
    alias: ["chopped", "sliced", "diced"],
    groceryStoreLocation: "deli",
    foodPairings: [
      "mozzarella cheese",
      "olives",
      "sun-dried tomatoes",
      "red wine",
    ],
    season: "All year",
  },
  {
    name: "bologna",
    alias: ["chopped", "sliced", "diced"],
    groceryStoreLocation: "deli",
    foodPairings: [
      "yellow mustard",
      "pickles",
      "white bread",
      "american cheese",
    ],
    season: "All year",
  },
  {
    name: "pastrami",
    alias: ["chopped", "sliced", "diced"],
    groceryStoreLocation: "deli",
    foodPairings: [
      "rye bread",
      "sauerkraut",
      "swiss cheese",
      "Russian dressing",
    ],
    season: "All year",
  },
  {
    name: "roasted chicken breast",
    alias: ["shredded", "sliced", "diced", "buffalo chicken"],
    groceryStoreLocation: "deli",
    foodPairings: ["lettuce", "tomato", "mayonnaise", "avocado"],
    season: "All year",
  },
  {
    name: "prosciutto",
    alias: ["chopped", "sliced", "diced"],
    groceryStoreLocation: "deli",
    foodPairings: ["figs", "melon", "balsamic glaze", "mozzarella"],
    season: "All year",
  },
  {
    name: "pepperoni",
    alias: ["chopped", "sliced", "diced"],
    groceryStoreLocation: "deli",
    foodPairings: [
      "pizza dough",
      "tomato sauce",
      "green bell pepper",
      "olives",
    ],
    season: "All year",
  },
  {
    name: "corned beef",
    alias: ["chopped", "sliced", "diced"],
    groceryStoreLocation: "deli",
    foodPairings: [
      "sauerkraut",
      "rye bread",
      "swiss cheese",
      "thousand island dressing",
    ],
    season: "All year",
  },
  {
    name: "capicola",
    alias: ["chopped", "sliced", "diced"],
    groceryStoreLocation: "deli",
    foodPairings: [
      "provolone cheese",
      "roasted red peppers",
      "arugula",
      "ciabatta bread",
    ],
    season: "All year",
  },
  {
    name: "liverwurst",
    alias: ["chopped", "sliced", "diced"],
    groceryStoreLocation: "deli",
    foodPairings: ["red onion", "mustard", "rye bread", "pickle slices"],
    season: "All year",
  },
  {
    name: "genoa salami",
    alias: ["chopped", "sliced", "diced"],
    groceryStoreLocation: "deli",
    foodPairings: ["provolone cheese", "pepperoncini", "olives", "baguette"],
    season: "All year",
  },
  {
    name: "soppressata",
    alias: ["chopped", "sliced", "diced"],
    groceryStoreLocation: "deli",
    foodPairings: [
      "provolone cheese",
      "olives",
      "roasted red peppers",
      "crusty bread",
    ],
    season: "All year",
  },
  {
    name: "smoked turkey",
    alias: ["chopped", "sliced", "diced"],
    groceryStoreLocation: "deli",
    foodPairings: ["cheddar cheese", "honey mustard", "lettuce", "tomato"],
    season: "All year",
  },
  {
    name: "provolone cheese",
    alias: ["sliced", "diced", "shredded", "grated"],
    groceryStoreLocation: "deli",
    foodPairings: ["salami", "ham", "turkey", "roast beef"],
    season: "All year",
  },
  {
    name: "parmesan",
    alias: ["sliced", "diced", "shredded", "grated"],
    groceryStoreLocation: "deli",
    foodPairings: ["pasta", "risotto", "garlic bread", "balsamic vinegar"],
    season: "All year",
  },
  {
    name: "cheddar cheese",
    alias: ["sliced", "diced", "shredded", "grated"],
    groceryStoreLocation: "deli",
    foodPairings: ["ham", "turkey", "apple slices", "crackers"],
    season: "All year",
  },
  {
    name: "swiss cheese",
    alias: ["sliced", "diced", "shredded", "grated"],
    groceryStoreLocation: "deli",
    foodPairings: ["ham", "turkey", "roast beef", "dijon mustard"],
    season: "All year",
  },
  {
    name: "american cheese",
    alias: ["sliced", "diced", "shredded", "grated"],
    groceryStoreLocation: "deli",
    foodPairings: ["ham", "turkey", "lettuce", "tomato"],
    season: "All year",
  },
  {
    name: "mozzarella cheese",
    alias: ["sliced", "diced", "shredded", "grated", "mini mozzarella", "ball"],
    groceryStoreLocation: "deli",
    foodPairings: ["tomato", "basil", "balsamic glaze", "crusty bread"],
    season: "All year",
  },
  {
    name: "pepper jack cheese",
    alias: ["sliced", "diced", "shredded", "grated"],
    groceryStoreLocation: "deli",
    foodPairings: ["turkey", "roast beef", "jalapenos", "avocado"],
    season: "All year",
  },
  {
    name: "muenster cheese",
    alias: ["sliced", "diced", "shredded", "grated"],
    groceryStoreLocation: "deli",
    foodPairings: ["ham", "turkey", "apple slices", "pretzel bread"],
    season: "All year",
  },
  {
    name: "colby jack cheese",
    alias: ["sliced", "diced", "shredded", "grated"],
    groceryStoreLocation: "deli",
    foodPairings: ["turkey", "ham", "pretzel bread", "honey mustard"],
    season: "All year",
  },
  {
    name: "gouda cheese",
    alias: ["sliced", "diced", "shredded", "grated"],
    groceryStoreLocation: "deli",
    foodPairings: ["ham", "turkey", "apple slices", "cranberry sauce"],
    season: "All year",
  },
  {
    name: "feta cheese",
    alias: ["crumbled", "brick"],
    groceryStoreLocation: "deli",
    foodPairings: ["cucumbers", "tomatoes", "olives", "red onion"],
    season: "All year",
  },
  {
    name: "blue cheese",
    alias: ["crumbled", "brick"],
    groceryStoreLocation: "deli",
    foodPairings: ["beef", "pear", "walnuts", "balsamic vinaigrette"],
    season: "All year",
  },
  {
    name: "gorgonzola cheese",
    alias: ["crumbled", "brick"],
    groceryStoreLocation: "deli",
    foodPairings: ["beef", "pear", "walnuts", "balsamic vinaigrette"],
    season: "All year",
  },
  {
    name: "asiago cheese",
    alias: ["sliced", "diced", "shredded", "grated"],
    groceryStoreLocation: "deli",
    foodPairings: ["roast beef", "prosciutto", "figs", "honey"],
    season: "All year",
  },
  {
    name: "havarti cheese",
    alias: ["sliced", "diced", "shredded", "grated"],
    groceryStoreLocation: "deli",
    foodPairings: ["turkey", "roast beef", "apple slices", "honey mustard"],
    season: "All year",
  },
  {
    name: "goat cheese",
    alias: ["crumbled", "brick"],
    groceryStoreLocation: "deli",
    foodPairings: ["beets", "spinach", "walnuts", "balsamic vinaigrette"],
    season: "All year",
  },
  {
    name: "cream cheese",
    alias: ["spreadable", "brick", "whipped", "diced"],
    groceryStoreLocation: "deli",
    foodPairings: ["bagels", "smoked salmon", "cucumber", "dill"],
    season: "All year",
  },
  {
    name: "pimento cheese",
    alias: ["spreadable", "brick", "whipped", "diced", "shredded", "grated"],
    groceryStoreLocation: "deli",
    foodPairings: ["crackers", "celery sticks", "pickles", "ham"],
    season: "All year",
  },
  {
    name: "olive loaf",
    alias: ["sliced", "diced", "cubed"],
    groceryStoreLocation: "deli",
    foodPairings: ["cream cheese", "lettuce", "tomato", "ciabatta bread"],
    season: "All year",
  },
  {
    name: "head cheese",
    alias: ["sliced", "diced", "shredded", "grated"],
    groceryStoreLocation: "deli",
    foodPairings: ["crackers", "pickles", "mustard", "rye bread"],
    season: "All year",
  },
  {
    name: "liver pate",
    alias: ["spreadable", "brick"],
    groceryStoreLocation: "deli",
    foodPairings: ["toast points", "cornichons", "red onion", "baguette"],
    season: "All year",
  },
  {
    name: "smoked salmon",
    alias: ["sliced", "diced", "shredded", "canned"],
    groceryStoreLocation: "deli",
    foodPairings: ["cream cheese", "cucumber", "red onion", "bagels"],
    season: "All year",
  },
  {
    name: "kielbasa sausage",
    alias: ["sliced", "diced", "whole"],
    groceryStoreLocation: "deli",
    foodPairings: ["sauerkraut", "mustard", "rye bread", "potato salad"],
    season: "All year",
  },
  {
    name: "hot dogs",
    alias: ["cooked", "diced", "whole", "chopped"],
    groceryStoreLocation: "deli",
    foodPairings: ["buns", "ketchup", "mustard", "relish"],
    season: "All year",
  },
];
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

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/recipes", recipeRouter);
app.use("/api/menus", menuRouter);
app.use("/api/user", userRouter);
app.use("/api/myGroceryList/", groceryListRouter);
app.use("/api/ingredients", ingredientsRouter);
addToIngredientDB(deliIngredients);

//these are meant to be called last
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
