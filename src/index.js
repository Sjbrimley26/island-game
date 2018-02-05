"use strict";

import "babel-polyfill";
import { createPlayer, getRandomInt } from "./assets/Player.js";
import itemDB from "./assets/ItemLibrary";
import Phaser from "./phaser";
import Client from './assets/Client';


function shuffle(a) { //shuffles an array in place
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
}

const GAME_CONFIG = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload,
    create,
    update
  }
};

let game = new Phaser.Game(GAME_CONFIG);

function preload() {
  game.playerMap = [];
  game.playerCount = 0;
  game.createPlayer = (x, y, image, name) => {
    let player = createPlayer(this.add.sprite(x, y, image), {
      id: game.playerCount,
      name
    });
    game.playerMap.push(player.id);
    game.playerCount++;
    return player;
  };

  game.onStartGame = () => {
    game.victory = false;
    console.log(game.playerMap);
    console.log(game.playerMap.length);
    console.log(game.playerMap[0]);
    shuffle(game.turnOrder);
    game.currentTurn = 0;
    game.nextTurn = () => {
      if (game.currentTurn !== 0) {
        console.log("If");
        game.turnOrder[game.currentTurn--].onEndTurn();
        game.turnOrder[game.currentTurn].onStartTurn();
      } else {
        console.log("Else");
        console.log(game.turnOrder.length);
        game.turnOrder[game.turnOrder.length - 1].onEndTurn();
        game.turnOrder[game.currentTurn].onStartTurn();
      }

      if (game.currentTurn !== game.turnOrder.length - 1) {
        game.currentTurn++;
      } else {
        game.currentTurn = 0;
      }
    };
  };

  Client[0](); //createClient, not sure why the function won't import by itself

  this.load.image("player", "assets/player.png");
}

function create() {
  game.Client.addServerPlayer({
    x: 50,
    y: 50,
    image: "player",
    name: "Spencer"
  });
  game.Client.addServerPlayer({
    x: 200,
    y: 200,
    image: "player",
    name: "Fred"
  });

  game.onStartGame();
  game.nextTurn();
}

function update() {}

/*

player1.pickUpItem(itemDB.getRandomCommon());
player1.pickUpItem(itemDB.getItem("dark orb"));

player1.transmuteItem("dark orb");

player2.stealRandomItem(player1);

player2.tradeItem(player1); //optional give and take arguments

*/
