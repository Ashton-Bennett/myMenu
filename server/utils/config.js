require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 3001;

module.exports = {
  MONGO_URL,
  PORT,
};
