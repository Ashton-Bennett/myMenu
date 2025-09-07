const authRouter = require("express").Router();
const User = require("../models/user");
const logger = require("../utils/logger");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

// Define cookie options based on environment
const cookieOptions = { httpOnly: true, secure: true, sameSite: "strict" };

authRouter.get("/refreshToken", async (request, response, next) => {
  try {
    const cookies = request?.cookies;
    const refreshToken = cookies?.refreshToken;

    // Clear cookie on client
    response.clearCookie("refreshToken", cookieOptions);

    if (!refreshToken) {
      return response.status(401).json({ error: "Not today JR!" });
    }

    const foundUser = await User.findOne({ refreshToken });

    // Detected refresh token reuse!
    if (!foundUser) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (error, decoded) => {
          if (error) {
            return response.status(403).json({ error: "Token invalid" });
          }
          logger.info("Attempted refresh token reuse detected!");
          const hackedUser = await User.findOne({ name: decoded.username });
          hackedUser.refreshToken = null;
          const result = await hackedUser.save();
          console.log(result);
        }
      );
      return response.status(403).json({ error: "User not found" });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (error, decoded) => {
        if (error) {
          console.log("expired Refresh token:");
          foundUser.refreshToken = null;
          const result = await foundUser.save();
          console.log(result);
        }
        if (error || foundUser.name !== decoded.username) {
          return response.status(403).json({ error: "Encoded user not found" });
        }

        //Refresh token is valid
        const accessToken = jwt.sign(
          { name: decoded.name },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15min" }
        );

        const newRefreshToken = jwt.sign(
          { username: foundUser.name },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );

        foundUser.refreshToken = newRefreshToken;
        await foundUser.save();
        response.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          secure: true,
          sameSite: "strict",
        });

        response.status(200).json({ accessToken, foundUser: foundUser.id });
      }
    );
  } catch (error) {
    next(error);
  }
});

authRouter.get("/logout", async (request, response, next) => {
  try {
    const cookies = request?.cookies;
    const refreshToken = cookies?.refreshToken;

    if (!refreshToken) {
      logger.info("Token not found, cookie cleared");
      return response.sendStatus(204); // No content
    }

    const foundUser = await User.findOne({ refreshToken });

    if (!foundUser) {
      response.clearCookie("jwt", cookieOptions);
      logger.info("User not found, cookie cleared");
      return response.sendStatus(204);
    }

    // Invalidate refresh token in DB
    foundUser.refreshToken = null;

    await foundUser.save();
    logger.info("USER:", foundUser);
    // Clear cookie on client
    response.clearCookie("refreshToken", cookieOptions);

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

// Login route
authRouter.post("/", async (request, response, next) => {
  const cookies = request?.cookies;
  logger.info("Cookies:", cookies);
  try {
    const { name, password } = request.body;

    if (!name || !password) {
      return response.status(400).json({
        error: "missing username or password",
      });
    }

    const foundUser = await User.findOne({ name });

    if (
      !foundUser ||
      !(await bcrypt.compare(password, foundUser.passwordHash))
    ) {
      return response.status(401).json({
        error: "invalid username or password",
      });
    }

    const accessToken = jwt.sign(
      { username: foundUser.name },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15min" }
    );

    const newRefreshToken = jwt.sign(
      { username: foundUser.name },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    if (cookies?.refreshToken) {
      response.clearCookie("refreshToken", cookieOptions);
    }

    foundUser.refreshToken = newRefreshToken;
    await foundUser.save();

    response
      .status(200)
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: "strict",
      })
      .json({ accessToken, user: foundUser.id });
  } catch (error) {
    next(error);
  }
});

// Login for Alexa route
authRouter.post("/alexa/login", async (request, response, next) => {
  try {
    const { name, password } = request.body;

    if (!name || !password) {
      return response.status(400).json({
        error: "missing username or password",
      });
    }

    const foundUser = await User.findOne({ name });

    if (
      !foundUser ||
      !(await bcrypt.compare(password, foundUser.passwordHash))
    ) {
      return response.status(401).json({
        error: "invalid username or password",
      });
    }

    const alexaAccessToken = jwt.sign(
      { username: foundUser.name },
      process.env.ALEXA_REFRESH_SECRET,
      { expiresIn: "900d" }
    );

    foundUser.alexaToken = alexaAccessToken;
    await foundUser.save();

    response.json({
      alexaAccessToken,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = authRouter;
