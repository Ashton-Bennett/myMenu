require("dotenv").config();

const OPEN_AI = process.env.OPENAI_API_KEY;
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 3001;
const IS_DEVELOPMENT = process.env.IS_DEVELOPMENT;

module.exports = {
  MONGO_URL,
  PORT,
  OPEN_AI,
  IS_DEVELOPMENT,
};
