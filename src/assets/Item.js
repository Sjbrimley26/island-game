function createItem(name, rarity) {
  return {
    name,
    rarity,
    use() {
      //Normal "Use" Case
      console.log(`${this.name} was used`);
    }
  };
}

function withCharges(item, charges = 1) {
  let { use, ...noUseItem } = item;
  return {
    ...noUseItem,
    charges: charges,
    initialCharges: charges,
    setCharges(charges) {
      this.charges = charges;
    },
    addCharges(charges) {
      this.charges += charges;
      if (this.charges > this.initialCharges * 2) {
        this.charges = this.initialCharges * 2;
      }
    },
    use() {
      if (this.charges > 0) {
        //Something AMAZING, I guess
        this.charges--;
        console.log(`${this.name} was used`);
      }
    }
  };
}

function createChargedItem(name, rarity, charges = 1) {
  return withCharges(createItem(name, rarity), charges);
}

function createFreeChargedItem(name, rarity, charges = 1) {
  let { use, ...noUseItem } = withCharges(createItem(name, rarity), charges);
  return {
    ...noUseItem,
    isFree: true,
    hasBeenUsed: false,
    use() {
      if (this.charges > 0) {
        this.charges--;
        this.hasBeenUsed = true;
        console.log(`${this.name} was used`);
      }
    }
  };
}

module.exports = {
  createItem,
  withCharges,
  createChargedItem,
  createFreeChargedItem
};
