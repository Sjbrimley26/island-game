import io from "socket.io-client";

function createClient() {
  game.Client = {};
  game.Client.socket = io.connect("http://localhost:3333");
  game.Client.addServerPlayer = data => {
    game.Client.socket.emit("newplayer", data);
  };

  game.Client.socket.on("newplayer", data => {
    console.log(game);
    game.createPlayer(data.x, data.y, data.image, data.name);
  });

  game.Client.socket.on("allplayers", data => {
    for (let i = 0; i < data.length; i++) {
      game.createPlayer(data[i].x, data[i].y, data[i].image, data[i].name);
    }
  });
}

module.exports = [createClient];
