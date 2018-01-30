import "babel-polyfill";
import { createPlayer } from './assets/Player.js';
import itemDB from './assets/ItemLibrary';

const player1 = createPlayer({ id: 1, name: "Spencer" });

player1.pickUpItem(itemDB.getRandomCommon());
player1.pickUpItem(itemDB.getItem("dark orb"));
player1.transmuteItem("dark orb");
player1.addStatusEffect("random recharge");
player1.onStartTurn();


console.dir(player1.inventory);
console.dir(player1);
