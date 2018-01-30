import { roll_the_dice, lucky_roll } from './Logic'
import itemDB from './ItemLibrary';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function createPlayer ({...args}) {
  return ({
    luck: 0,
    sanity: 1,
    inventory: [],
    id: args.id,
    name: args.name,
    active: false,
    turn: 0,
    status: [],
    hasMoved: false,
    hasUsedItem: false,

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

    normalizeLuck () {
      const diff = Math.abs(this.luck * 10 - 10);
      if (this.luck > 1) {
        this.changeLuck( - ( Math.round(diff * 10/3)) / 10 );
      }
      else {
        this.changeLuck( ( Math.round(diff * 10/3)) / 10 );
      }
    },

    goInsane () {
      this.sanity = 1;
      this.addStatusEffect("stunned");
    },

    pickUpItem (item) { //Use item for new or exterior items
      const the_item = this.getPlayerItem(item.name);
      if (the_item === undefined) {
        this.inventory.push({...item});
      }
      else {
        the_item.addCharges(item.charges);
      }
    },

    useItem (name) { //Use name for already owned items
      //the item used as the argument should be the name of the item
      //this is because the player is not actually holding the object,
      //but a clone of the object, so finding it by name makes sense.
      const the_item = this.getPlayerItem(name);
      if (the_item !== undefined && (!this.hasUsedItem || (the_item.isFree && !the_item.hasBeenUsed))) {
        this.triggerItemEffect(the_item);
        if (the_item.charges === 0) {
          const deleted_index = this.inventory.indexOf(the_item); //Should I delete the item
          this.inventory.splice(deleted_index, 1);              //or leave it in the inventory
        }                                                       //with no charges?
      }
    },

    triggerItemEffect(item) {
      item.use();
      this.hasUsedItem = true;

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

        case "magic batteries":
          let i; //Now how to select...?
          this.inventory[i].addCharges(2);
          break;
      }
    },

    stealRandomItem (player) {
      if (player.inventory.length > 0) {
        const stolenItem = player.inventory.splice(getRandomInt(player.inventory.length), 1);
        this.pickUpItem(stolenItem[0]);
      }
    },

    tradeRandomItem (player) {
      if (player.inventory.length > 0) {
        const itemToGive = this.inventory.splice(getRandomInt(this.inventory.length), 1);
        const itemToTake = player.inventory.splice(getRandomInt(player.inventory.length), 1);
        this.pickUpItem(itemToTake[0]);
        player.pickUpItem(itemToGive[0]);
      }
    },

    addStatusEffect (effect) {
      if (this.status.indexOf(effect) === -1) {
        this.status.push(effect);
      }
    },

    triggerStatusEffect (effect) {
      let effectArr = effect.split(" ");
      if (effectArr.length === 1) {
        switch (effect) {
          case "stunned":
            this.hasMoved = true;
            this.hasUsedItem = true;
            this.changeLuck(.02);
            break;
          case "trapped":
            this.hasMoved = true;
            break;
          case "tied":
            this.hasUsedItem = true;
            break;
          case "random recharge":
            this.rechargeItem(this.inventory[getRandomInt(this.inventory.length)]);
            break;
        }
      }
      else {
        switch (effectArr[0]) {
          case "draw": // so you could do "draw 2" for example
            for (let i = 0; i < parseInt(effectArr[1]); i++) {
              if (effectArr[2]) { // or "draw 2 common"
                switch (effectArr[2]) {
                  case "common":
                    this.pickUpItem(itemDB.getRandomCommon());
                    break;
                  case "uncommon":
                    this.pickUpItem(itemDB.getRandomUncommon());
                    break;
                  case "rare":
                    this.pickUpItem(itemDB.getRandomRare());
                    break;
                }
              }
              else {
                this.pickUpItem(itemDB.getRandomItem());
              }
            }
            break;
        }
      }

    },

    rechargeItem (item) {
      const the_item = this.getPlayerItem(item.name);
      if (the_item !== undefined) {
        if (the_item.charges < the_item.initialCharges) {
          the_item.setCharges(item.initialCharges);
        }
      }
    },

    transmuteItem (name, optionalRarity) { //Removes an item from your inventory and returns a different one of the same rarity
      const the_item = this.getPlayerItem(name);
      if (the_item !== undefined) {
        const itemIndex = this.inventory.indexOf(the_item);
        let rarity;
        if (optionalRarity) {
          rarity = optionalRarity;
        }
        else {
          rarity = the_item.rarity;
        }
        switch (rarity) {
          case "common":
            this.inventory.splice(itemIndex, 1);
            this.pickUpItem(itemDB.getRandomCommon(the_item.name));
            break;
          case "uncommon":
            this.inventory.splice(itemIndex, 1);
            this.pickUpItem(itemDB.getRandomUncommon(the_item.name));
            break;
          case "rare":
            this.inventory.splice(itemIndex, 1);
            this.pickUpItem(itemDB.getRandomRare(the_item.name));
            break;
        }
      }
    },

    getPlayerItem (name) {
      const the_item = this.inventory.find(function(element){
        return element.name === name;
      });
      return the_item;
    },

    onStartTurn () {
      this.turn += 1;
      this.hasUsedItem = false;
      this.hasMoved = false;

      if (this.luck > 1) {
        this.normalizeLuck(); //So if a player has high luck, it decreases a bit at the start
                              //of each turn.
      }

      if (this.sanity === 0) {
        this.goInsane();
      }

      if (this.inventory.length < 6) {
        if (this.turn <= 5) {
          this.pickUpItem(itemDB.getRandomCommon());
        }
        else {
          this.pickUpItem(itemDB.getRandomUncommon());
        }
      }

      this.status.forEach((effect) => {
        this.triggerStatusEffect(effect);
      });
      this.status = [];

      this.active = true;

    },

    onEndTurn () {
      if (this.inventory.length > 6) { //Should probably let them choose which to discard
        this.inventory.splice(getRandomInt(this.inventory.length), 1);
      }

      for (item in this.inventory) {
        if (item.hasOwnProperty("hasBeenUsed")) {
          item.hasBeenUsed = false;
        }
      }

      this.active = false;

    },

  });
};

module.exports = {
  createPlayer
};
