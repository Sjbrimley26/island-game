import { createPlayer } from './assets/Player.js';
import itemDB from './assets/ItemLibrary';

const player1 = createPlayer({ id: 1, name: "Spencer" });

player1.pickUpItem(itemDB.getRandomCommon());
player1.pickUpItem(itemDB.getItem("dark orb"));
player1.transmuteItem(itemDB.getItem("dark orb"));


console.dir(player1.inventory);
