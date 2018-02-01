import "babel-polyfill";
import { createPlayer, getRandomInt } from "./assets/Player.js";
import itemDB from "./assets/ItemLibrary";
import { Phaser } from "./phaser";

const player1 = createPlayer({ id: 1, name: "Spencer" });
const player2 = createPlayer({ id: 2, name: "Fred" });

player1.pickUpItem(itemDB.getRandomCommon());
player1.pickUpItem(itemDB.getItem("dark orb"));

player1.transmuteItem("dark orb");

player2.stealRandomItem(player1);

player2.tradeItem(player1); //optional give and take arguments
