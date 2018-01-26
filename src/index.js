import { createPlayer } from './assets/Player.js';
import itemDictionary from './assets/ItemLibrary';

const player1 = createPlayer({ id: 1, name: "Spencer" });


console.dir(player1.inventory);
