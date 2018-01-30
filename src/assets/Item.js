function createItem (name, rarity) {
  return ({
    name,
    rarity,
    use () {
      if (this.hasOwnProperty("charges")) {
        if (this.charges > 0) {
          //Something AMAZING, I guess
          this.charges--;
        }
      }
      //Normal "Use" Case
      console.log(`${this.name} was used`);
    }
  })
};

function withCharges (item, charges = 1) {
  return ({
    ...item,
    "charges": charges,
    "initialCharges": charges,
    setCharges (charges) {
      this.charges = charges;
    },
    addCharges (charges) {
      this.charges += charges;
      if (this.charges > (this.initialCharges * 2)) {
        this.charges = this.initialCharges * 2;
      }
    }

  })
};

function createChargedItem (name, rarity, charges = 1) {
    let item = withCharges(createItem(name, rarity), charges);
    return item;
};

function createFreeChargedItem (name, rarity, charges = 1) {
  let item = withCharges(createItem(name, rarity), charges);
  item.isFree = true;
  return item;
};

module.exports = {
  createItem,
  withCharges,
  createChargedItem,
  createFreeChargedItem
};
