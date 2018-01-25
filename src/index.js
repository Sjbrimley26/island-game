import { createPlayer } from './assets/Player.js';
import itemDictionary from './assets/ItemLibrary';

const player1 = createPlayer({ id: 1, name: "Spencer" });
player1.pickUpItem(itemDictionary.rabbit_foot);

console.dir(player1.inventory);
