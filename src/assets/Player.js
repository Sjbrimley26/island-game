import { roll_the_dice, lucky_roll } from './Logic'
import itemDB from './ItemLibrary';

function createPlayer ({...args}) {
  return ({
    luck: 0,
    sanity: 1,
    inventory: [],
    id: args.id,
    name: args.name,
    active: false,

    changeSanity (amount) {
      //amount should be between -1 and 1
      this.sanity = (this.sanity * 10 + amount * 10) / 10;
      if (this.sanity > 1) {
        this.sanity = 1;
      }
      if (this.sanity < 0) {
        this.sanity = 0;
      }
    },

    changeLuck (amount) {
      //a luck of .5 rolling a 100-sided die will have a range of 50 - 150, that seems like a good range to me
      //so this amount should be between -.5 and .5, though I suppose it could be 1 for a complete flip
      //so all odds in this game will fall between -49% and 150%
      this.luck = (this.luck * 10 + amount * 10) / 10;
      if (this.luck > .5) {
        this.luck = .5;
      }
      if (this.luck < -.5) {
        this.luck = -.5;
      }
    },

    pickUpItem (item) { //Use item for new or exterior items
      const the_item = this.getPlayerItem(item.name);
      if (the_item === undefined) {
        this.inventory.push(Object.assign({}, item));
      }
      else {
        the_item.charges += item.charges;
      }
    },

    useItem (name) { //Use name for already owned items
      //the item used as the argument should be the name of the item
      //this is because the player is not actually holding the object,
      //but a clone of the object, so finding it by name makes sense.
      const the_item = this.getPlayerItem(name);
      if (the_item !== undefined) {
        this.triggerEffect(the_item);
        if (the_item.charges === 0) {
          const deleted_index = this.inventory.indexOf(the_item); //Should I delete the item
          this.inventory.splice(deleted_index, 1);              //or leave it in the inventory
        }                                                       //with no charges?
      }
    },

    triggerItemEffect(item) {
      item.use();

      switch(item.name) {

        case "rabbit foot":
          this.changeLuck(.07);
          break;

        case "coin of fate":
          if (roll_the_dice(2) === 1) {
            this.changeLuck(-.1);
          }
          else {
            this.changeLuck(.1);
          }
          break;

        case "dark orb":
          if (lucky_roll(100, this) < 10) {
            //critical failure
            this.changeLuck(.5);
            this.changeSanity(-1);
          }
          else if (lucky_roll(100, this) < 50) {
            //fail
            this.changeLuck(.03);
            this.changeSanity(-.2);
          }
          else if (lucky_roll(100, this) >= 98) {
            //critical success
            this.changeLuck(-2);
            //something amazing I guess
          }
          else {
            //something cool
            this.changeSanity(-.1);
          }
          break;

        case "cursed portal":
          if (this.sanity < .5) {
            //no effect
            item.charges++;
          }
          else {
            //give player choice to go to somewhere
            //that choice will return an x, y coordinate

            //choose_target should trigger a click effect,
            //like making all the tiles clickable and on click
            //the clicked tile's x and y is returned
            this.changeSanity(-2);
          }
          break;
      }
    },

    rechargeItem (item) {
      const the_item = this.getPlayerItem(item.name);
      if (the_item !== undefined) {
        the_item.setCharges(item.charges);
      }
    },

    transmuteItem (name) { //Removes an item from your inventory and returns a different one of the same rarity
      const the_item = this.getPlayerItem(name);
      if (the_item !== undefined) {
        const itemIndex = this.inventory.indexOf(the_item);
        const rarity = the_item.rarity;
        switch (rarity) {
          case "common":
            this.inventory.splice(itemIndex, 1);
            this.pickUpItem(itemDB.getRandomCommon(the_item));
            break;
          case "uncommon":
            this.inventory.splice(itemIndex, 1);
            this.pickUpItem(itemDB.getRandomUncommon(the_item));
            break;
          case "rare":
            this.inventory.splice(itemIndex, 1);
            this.pickUpItem(itemDB.getRandomRare(the_item));
            break;
        }
      }
    },

    getPlayerItem (name) {
      const the_item = this.inventory.find(function(element){
        return element.name === name;
      });
      return the_item;
    }
  });
};

module.exports = {
  createPlayer
};
