import {
  createItem,
  withCharges,
  createChargedItem,
  createFreeChargedItem,
  targetsItem,
  targetsEnemy,
  targetsTile
} from "./Item";

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const rabbit_foot = createFreeChargedItem("rabbit foot", "common");
const fate_coin = createFreeChargedItem("coin of fate", "uncommon", 3); //Okay so now charges will be a random number
const dark_orb = createChargedItem("dark orb", "rare", 4); //between 1 and this number, determined on pick up
const cursed_portal = targetsTile(createChargedItem("cursed portal", "rare"));
const gelatinous_mass = createChargedItem("gelatinous mass", "uncommon");
const magic_batteries = targetsItem(
  createFreeChargedItem("magic batteries", "uncommon")
);
const draw_two = createChargedItem("draw two", "common");
const draw_four = targetsEnemy(createChargedItem("draw four", "uncommon"));
const rock = createChargedItem("rock", "special", 2); //special items won't be randomly chosen
const lucky_lasso = targetsEnemy(createChargedItem("lucky lasso", "common"));
const jack_in_the_box = targetsTile(
  createChargedItem("jack in the box", "common", 3)
);
const felix_felicis = createFreeChargedItem("felix felicis", "uncommon");
const mulligan = createChargedItem("mulligan", "common");
const regift = targetsItem(createChargedItem("regift", "common"));
const upgrade = targetsItem(createChargedItem("upgrade", "uncommon"));
const switcheroo = targetsItem(
  targetsEnemy(createChargedItem("switcheroo", "common"))
);
const trade = targetsItem(targetsEnemy(createChargedItem("trade", "common")));
const caltrops = targetsTile(createChargedItem("caltrops", "common", 2));
const bola_trap = targetsTile(createChargedItem("bola trap", "common", 2));
const tesla_coil = targetsTile(createChargedItem("tesla coil", "uncommon"));
const distracting_magazine = targetsTile(
  createChargedItem("distracting magazine", "uncommon")
);
const net_gun = targetsEnemy(createChargedItem("net gun", "uncommon"));
const finger_trap = targetsEnemy(createChargedItem("finger trap", "uncommon"));

const itemList = [
  rabbit_foot,
  fate_coin,
  dark_orb,
  cursed_portal,
  gelatinous_mass,
  magic_batteries,
  draw_two,
  draw_four,
  rock,
  lucky_lasso,
  jack_in_the_box,
  felix_felicis,
  mulligan,
  regift,
  upgrade,
  switcheroo,
  trade,
  caltrops,
  bola_trap,
  tesla_coil,
  distracting_magazine,
  net_gun,
  finger_trap
];

const commonsList = itemList.filter(item => item.rarity === "common");
const uncommonsList = itemList.filter(item => item.rarity === "uncommon");
const raresList = itemList.filter(item => item.rarity === "rare");
const normalsList = itemList.filter(item => item.rarity !== "special");

const itemDB = {
  itemList,
  commonsList,
  raresList,
  uncommonsList,
  normalsList,

  getRandomCommon(exclusion) {
    //exclusion must be a name
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
    return this.normalsList[getRandomInt(this.normalsList.length)];
  },

  getItem(name) {
    return this.itemList.find(item => item.name === name);
  }
};

export default itemDB;
