const app = require("./app");

// logger.info is the same as console.log & logger.error is = console.error
const logger = require("./utils/logger");
const config = require("./utils/config");

app.listen(config.PORT, () => {
  logger.info(
    `Server running on port ${config.PORT} link--> http://localhost:${config.PORT}/`
  );
});
