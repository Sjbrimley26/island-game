import { createItem , withCharges , createChargedItem } from './Item';

const rabbit_foot = createChargedItem("rabbit foot", "common",  1);
const fate_coin = createChargedItem("coin of fate", "uncommon", 3);
const dark_orb = createChargedItem("dark orb", "rare", 4);
const cursed_portal = createChargedItem("cursed portal", "rare", 1);

const itemDictionary = {
  rabbit_foot,
  fate_coin,
  dark_orb,
  cursed_portal
};

export default itemDictionary;
