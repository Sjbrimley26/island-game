import "babel-polyfill";
import { createPlayer } from './assets/Player.js';
import itemDB from './assets/ItemLibrary';

const player1 = createPlayer({ id: 1, name: "Spencer" });
const player2 = createPlayer({ id: 2, name: "Fred" });

player1.pickUpItem(itemDB.getRandomCommon());
player1.pickUpItem(itemDB.getItem("dark orb"));
player1.transmuteItem("dark orb");
player1.inventory.forEach((item) => console.log(item));
player2.stealRandomItem(player1);

player2.tradeRandomItem(player1);
console.log("Trade Results");
console.dir(player1.inventory);
console.dir(player2.inventory);
