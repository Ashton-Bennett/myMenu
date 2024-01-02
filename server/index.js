const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "https://the-menu-by-ashton-bennett.fly.dev/",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected to WebSocket their id:", socket.id);

  socket.on("disconnect", (socket) => {
    console.log(`User with id ${socket.id} disconnected`);
  });
  socket.on("update_user", (userObj) => {
    socket.broadcast.emit("share_updated_user", userObj);
  });
});
// logger.info is the same as console.log & logger.error is = console.error
const logger = require("./utils/logger");
const config = require("./utils/config");

server.listen(config.PORT, () => {
  logger.info(
    `Server running on port ${config.PORT} link--> http://localhost:${config.PORT}/`
  );
});
