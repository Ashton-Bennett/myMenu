const userRouter = require("express").Router();
const User = require("../models/user");
const logger = require("../utils/logger");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const middleware = require("../utils/middleware");

userRouter.get("/", middleware.verifyToken, (request, response, next) => {
  User.find({})
    .then((users) => {
      response.json(users);
    })
    .catch((error) => next(error));
});

userRouter.get("/:id", middleware.verifyToken, (request, response, next) => {
  const id = request.params.id;
  User.findById(id)
    .then((user) => {
      user ? response.json(user) : response.status(404).end();
    })
    .catch((error) => next(error));
});

userRouter.delete(
  "/:id",
  middleware.verifyToken,
  async (request, response, next) => {
    try {
      const id = request.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(400).json({ error: "Invalid user ID." });
      }

      const userToDelete = await User.findById(id);

      await User.findByIdAndDelete(id);
      logger.info(`${userToDelete.name} user was deleted`);
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

userRouter.post("/", async (request, response, next) => {
  const { name, email, password } = request.body;
  const existingUser = await User.findOne({ name });
  if (existingUser) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  if (name.length < 5) {
    return response.status(400).json({
      error: "username must be longer than 5 characters",
    });
  }

  if (password.length < 5) {
    return response.status(400).json({
      error: "password must be longer than 5 characters",
    });
  }

  if (email.length < 5 || !email.includes("@")) {
    return response.status(400).json({
      error: "email must be valid",
    });
  }

  const existingUserByEmail = await User.findOne({ email });
  if (existingUserByEmail) {
    return response.status(400).json({
      error: "An account with this email address already exists",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    name,
    email,
    passwordHash,
  });

  const savedUser = await user.save();
  console.log("USER CREATED");
  response.status(201).json(savedUser);
});

userRouter.put(
  "/:id",
  middleware.verifyToken,
  async (request, response, next) => {
    const id = request.params.id;
    const updatedUser = request.body;

    const existingUser = await User.findOne({ email: updatedUser.email });

    if (existingUser && existingUser._id.toString() !== updatedUser.id) {
      // Email is already taken by a different user
      return response.status(400).json({ error: "Email is already in use." });
    }

    User.findByIdAndUpdate(id, updatedUser, {
      new: true,
      runValidators: true,
      context: "query",
    })
      .then((updatedNote) => {
        response.json(updatedNote);
      })
      .catch((error) => next(error));
  }
);

userRouter.put(
  "/resetPassword/:id",
  middleware.verifyToken,
  async (request, response, next) => {
    const id = request.params.id;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash("password123", saltRounds);

    User.findByIdAndUpdate(
      id,
      { passwordHash: passwordHash },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    )
      .then((updatedNote) => {
        response.json(updatedNote);
      })
      .catch((error) => next(error));
  }
);

module.exports = userRouter;
