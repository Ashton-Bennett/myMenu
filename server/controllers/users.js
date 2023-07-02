const userRouter = require("express").Router();
const User = require("../models/user");
const logger = require("../utils/logger");

userRouter.get("/", (request, response, next) => {
  User.find({})
    .then((users) => {
      response.json(users);
    })
    .catch((error) => next(error));
});

userRouter.get("/:id", (request, response, next) => {
  const id = request.params.id;
  User.findById(id)
    .then((user) => {
      user ? response.json(user) : response.status(404).end();
    })
    .catch((error) => next(error));
});

userRouter.delete("/:id", (request, response, next) => {
  const id = request.params.id;
  User.findByIdAndDelete(id)
    .then((result) => {
      logger.info(`${result.name} user was deleted `);
      response.status(204).end();
    })
    .catch((error) => next(error));
});

userRouter.post("/", (request, response, next) => {
  const user = request.body;
  const newUser = new User(user);

  newUser
    .save()
    .then((savedUser) => {
      response.json(savedUser);
      logger.info(`-> ADDED ${user.name} user`);
    })
    .catch((error) => next(error));
});

userRouter.put("/:id", (request, response, next) => {
  const id = request.params.id;
  //   User.findById(id)
  //     .then((user) => {
  //       user ? console.log("user id found") : console.log("user id NOT found"),
  //         response.status(404).end();
  //     })
  //     .catch((error) => next(error));

  const updatedUser = request.body;

  User.findByIdAndUpdate(id, updatedUser, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

module.exports = userRouter;
