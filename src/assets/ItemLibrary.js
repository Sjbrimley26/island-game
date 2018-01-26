import { createItem , withCharges , createChargedItem } from './Item';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const rabbit_foot = createChargedItem("rabbit foot", "common");
const fate_coin = createChargedItem("coin of fate", "uncommon", 3);
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
  uncommonsList,
  raresList,

  getRandomCommon () {
    return commonsList[getRandomInt(commonsList.length)];
  },
};

export default itemDB;
