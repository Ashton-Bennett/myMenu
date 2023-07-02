import { Ingredient } from "../types";

const produceItems = {
  apples: "produce",
  bananas: "produce",
  oranges: "produce",
  tomatoes: "produce",
  cucumbers: "produce",
  lettuce: "produce",
  carrots: "produce",
  broccoli: "produce",
  strawberries: "produce",
  grapes: "produce",
  blueberries: "produce",
  pineapple: "produce",
  watermelon: "produce",
  peaches: "produce",
  plums: "produce",
  kiwi: "produce",
  spinach: "produce",
  "bell peppers": "produce",
  onions: "produce",
  potatoes: "produce",
  avocado: "produce",
  cauliflower: "produce",
  celery: "produce",
  zucchini: "produce",
  radishes: "produce",
  "green beans": "produce",
  asparagus: "produce",
  eggplant: "produce",
  mango: "produce",
  pears: "produce",
  raspberries: "produce",
  blackberries: "produce",
  lemons: "produce",
  limes: "produce",
  papaya: "produce",
  cantaloupe: "produce",
  honeydew: "produce",
  apricots: "produce",
  cherries: "produce",
  "brussels sprouts": "produce",
  corn: "produce",
  garlic: "produce",
  ginger: "produce",
  artichokes: "produce",
  cranberries: "produce",
  pomegranate: "produce",
  dates: "produce",
  lychee: "produce",
  persimmons: "produce",
  "green onions": "produce",
  "red pepper": "produce",
  "green pepper": "produce",
  basil: "produce",
  cilantro: "produce",
  parsley: "produce",
  rosemary: "produce",
  thyme: "produce",
  sage: "produce",
  dill: "produce",
  mint: "produce",
};

const findIngredientShoppingLocation = (item: Ingredient): Ingredient => {
  if (produceItems.hasOwnProperty(item.name.toLocaleLowerCase())) {
    return { ...item, groceryStoreLocation: "produce" };
  }

  return { ...item, groceryStoreLocation: "unknown" };
};

export default findIngredientShoppingLocation;
