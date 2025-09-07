const menuRouter = require("express").Router();
const Menu = require("../models/menu");
const logger = require("../utils/logger");

menuRouter.get("/", (request, response, next) => {
  Menu.find({})
    .then((menus) => {
      response.json(menus);
    })
    .catch((error) => next(error));
});

menuRouter.get("/private/:id", (request, response, next) => {
  const id = request.params.id;
  Menu.find({ createdById: id })
    .then((menus) => {
      response.json(menus);
    })
    .catch((error) => next(error));
});

menuRouter.get("/public", (request, response, next) => {
  Menu.find({ isPublic: true })
    .then((menus) => {
      response.json(menus);
    })
    .catch((error) => next(error));
});

menuRouter.get("/:id", (request, response, next) => {
  const id = request.params.id;
  Menu.findById(id)
    .then((menu) => {
      menu ? response.json(menu) : response.status(404).end();
    })
    .catch((error) => next(error));
});

menuRouter.delete("/:id", (request, response, next) => {
  const id = request.params.id;
  Menu.findByIdAndDelete(id)
    .then((result) => {
      logger.info(`${result.name} menu was deleted `);
      response.status(204).end();
    })
    .catch((error) => next(error));
});

menuRouter.post("/", async (request, response, next) => {
  try {
    const menu = request.body;
    const newMenu = new Menu(menu);

    const savedMenu = await newMenu.save();
    response.status(201).json(savedMenu); // 201 = Created
    logger.info(`-> ADDED ${menu.name} menu`);
  } catch (error) {
    next(error);
  }
});

menuRouter.put("/:id", (request, response, next) => {
  const updatedmenu = request.body;
  const id = request.params.id;

  Menu.findByIdAndUpdate(id, updatedmenu, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

module.exports = menuRouter;
