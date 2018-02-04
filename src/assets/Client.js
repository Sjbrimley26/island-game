import io from "socket.io-client";

let Client = {};
Client.socket = io.connect("http://localhost:3333");

Client.addNewPlayer = data => {
  Client.socket.emit("newplayer", data);
};

Client.socket.on("newplayer", data => {
  game.createPlayer(data.x, data.y, data.image, data.name);
});

Client.socket.on("allplayers", data => {
  for (let i = 0; i < data.length; i++) {
    game.createPlayer(data[i].x, data[i].y, data[i].image, data[i].name);
  }
});

module.exports = [Client];
