import { roll_the_dice, lucky_roll } from './Logic'

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

    pickUpItem (item) {
      let the_item = this.inventory.find(function(element){
        return element.name === item.name;
      });
      if (the_item === undefined) {
        this.inventory.push(Object.assign({}, item));
      }
      else {
        the_item.charge += item.charge;
      }
    },

    useItem (item) {
      //the item used as the argument should be the name of the item
      //this is because the player is not actually holding the object,
      //but a clone of the object, so finding it by name makes sense.
      let the_item = this.inventory.find(function(element){
        return element.name === item;
      });
      this.triggerEffect(this, the_item);
      if (the_item.charge === 0) {
        let deleted_index = this.inventory.indexOf(the_item);
        this.inventory.splice(deleted_index, 1);
      }
    },

    triggerEffect(player, item) {
      item.use();

      switch(item.name) {
        
        case "rabbit foot":
          player.changeLuck(.07);
          break;

        case "coin of fate":
          if (roll_the_dice(2) === 1) {
            player.changeLuck(-.1);
          }
          else {
            player.changeLuck(.1);
          }
          break;

        case "dark orb":
          if (lucky_roll(100, player) < 10) {
            //critical failure
            player.changeLuck(.5);
            player.changeSanity(-1);
          }
          else if (lucky_roll(100, player) < 50) {
            //fail
            player.changeLuck(.03);
            player.changeSanity(-.2);
          }
          else if (lucky_roll(100, player) >= 100) {
            //critical success
            player.changeLuck(-2);
            //something amazing I guess
          }
          else {
            //something cool
            player.changeSanity(-.1);
          }
          break;

        case "cursed portal":
          if (player.sanity < .5) {
            //no effect
            item.charge++;
          }
          else {
            //give player choice to go to somewhere
            //that choice will return an x, y coordinate

            //choose_target should trigger a click effect,
            //like making all the tiles clickable and on click
            //the clicked tile's x and y is returned
            player.changeSanity(-2);
          }
          break;
      }
    }
  });
};

module.exports = {
  createPlayer
};
