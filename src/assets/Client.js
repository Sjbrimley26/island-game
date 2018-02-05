import io from "socket.io-client";

function createClient(game) {
  let Client = {};
  Client.socket = io.connect("http://localhost:3333");

  Client.addServerPlayer = data => {
    Client.socket.emit("newplayer", data);
  };

  Client.socket.on("newplayer", data => {
    Client.createPlayer(data.x, data.y, data.image, data.name);
  });

  Client.socket.on("allplayers", data => {
    for (let i = 0; i < data.length; i++) {
      Client.createPlayer(data[i].x, data[i].y, data[i].image, data[i].name);
    }
  });
  return { ...game, ...Client };
}

module.exports = [createClient];
