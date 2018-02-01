import {
  createItem,
  withCharges,
  createChargedItem,
  createFreeChargedItem
} from "./Item";

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const rabbit_foot = createFreeChargedItem("rabbit foot", "common");
const fate_coin = createFreeChargedItem("coin of fate", "uncommon", 3); //Okay so now charges will be a random number
const dark_orb = createChargedItem("dark orb", "rare", 4); //between 1 and this number, determined on pick up
const cursed_portal = createChargedItem("cursed portal", "rare");
const gelatinous_mass = createChargedItem("gelatinous mass", "uncommon");
const magic_batteries = createFreeChargedItem("magic batteries", "uncommon");
const draw_two = createChargedItem("draw two", "common");
const draw_four = createChargedItem("draw four", "uncommon");
const rock = createChargedItem("rock", "special", 2); //special items won't be randomly chosen

const itemList = [
  rabbit_foot,
  fate_coin,
  dark_orb,
  cursed_portal,
  gelatinous_mass,
  magic_batteries,
  draw_two,
  draw_four,
  rock
];

const commonsList = itemList.filter(item => item.rarity === "common");
const uncommonsList = itemList.filter(item => item.rarity === "uncommon");
const raresList = itemList.filter(item => item.rarity === "rare");

const itemDB = {
  itemList,
  commonsList,
  raresList,
  uncommonsList,

  getRandomCommon(exclusion) {
    //returns any random common item but the exclusion
    if (!exclusion) {
      return this.commonsList[getRandomInt(this.commonsList.length)];
    } else {
      let newItem;
      do {
        newItem = this.commonsList[getRandomInt(this.commonsList.length)];
      } while (newItem.name === exclusion);
      return newItem;
    }
  },

  getRandomUncommon(exclusion) {
    if (!exclusion) {
      return this.uncommonsList[getRandomInt(this.uncommonsList.length)];
    } else {
      let newItem;
      do {
        newItem = this.uncommonsList[getRandomInt(this.uncommonsList.length)];
      } while (newItem.name === exclusion);
      return newItem;
    }
  },

  getRandomRare(exclusion) {
    if (!exclusion) {
      return this.raresList[getRandomInt(this.raresList.length)];
    } else {
      let newItem;
      do {
        newItem = this.raresList[getRandomInt(this.raresList.length)];
      } while (newItem.name === exclusion);
      return newItem;
    }
  },

  getRandomItem() {
    return this.itemList[getRandomInt(this.itemList.length)];
  },

  getItem(name) {
    return this.itemList.find(item => item.name === name);
  }
};

export default itemDB;
