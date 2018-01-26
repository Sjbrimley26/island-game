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

function withCharges (item) {
  return ({
    ...item,
    "charges": 1,
    setCharges (charges) {
      this.charges = charges;
    }

  })
};

function createChargedItem (name, rarity, charges = 1) {
    let item = withCharges(createItem(name, rarity));
    item.setCharges(charges);
    return item;
};

module.exports = {
  createItem,
  withCharges,
  createChargedItem
};
