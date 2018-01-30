import { createItem , withCharges , createChargedItem, createFreeChargedItem } from './Item';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const rabbit_foot = createFreeChargedItem("rabbit foot", "common");
const fate_coin = createFreeChargedItem("coin of fate", "uncommon", 3);
const dark_orb = createChargedItem("dark orb", "rare", 4);
const cursed_portal = createChargedItem("cursed portal", "rare");

const itemList = [
  rabbit_foot,
  fate_coin,
  dark_orb,
  cursed_portal
];

const commonsList = itemList.filter(item => item.rarity === "common");
const uncommonsList = itemList.filter(item => item.rarity === "uncommon");
const raresList = itemList.filter(item => item.rarity === "rare");

const itemDB = {
  itemList,
  commonsList,
  raresList,
  uncommonsList,

  getRandomCommon ( exclusion ) { //returns any random common item but the exclusion
    if (!exclusion) {
      return this.commonsList[getRandomInt(this.commonsList.length)];
    }
    else {
      let newItem;
      do {
        newItem = this.commonsList[getRandomInt(this.commonsList.length)];
      } while (newItem === exclusion);
      return newItem;
    }
  },

  getRandomUncommon ( exclusion ) {
    if (!exclusion) {
      return this.uncommonsList[getRandomInt(this.uncommonsList.length)];
    }
    else {
      let newItem;
      do {
        newItem = this.uncommonsList[getRandomInt(this.uncommonsList.length)];
      } while (newItem === exclusion);
      return newItem;
    }
  },

  getRandomRare ( exclusion ) {
    if (!exclusion) {
      return this.raresList[getRandomInt(this.raresList.length)];
    }
    else {
      let newItem;
      do {
        newItem = this.raresList[getRandomInt(this.raresList.length)];
      } while (newItem === exclusion);
      return newItem;
    }
  },

  getRandomItem () {
    return this.itemList[getRandomInt(this.itemList.length)];
  },

  getItem (name) {
    return this.itemList.find(item => item.name === name);
  }

}

export default itemDB;
