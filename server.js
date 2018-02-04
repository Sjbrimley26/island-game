const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = 3333;

app.use(express.static("dist"));
app.use("/assets/", express.static("game_assets"));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "./dist/" });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

io.on("connection", socket => {
  socket.on("newplayer", data => {
    socket.player = { ...data };
    socket.emit("allplayers", getAllPlayers());
    socket.broadcast.emit("newplayer", data);
  });
});

getAllPlayers = () => {
  var players = [];
  Object.keys(io.sockets.connected).forEach(function(socketID) {
    var player = io.sockets.connected[socketID].player;
    if (player) players.push(player);
  });
  return players;
};
