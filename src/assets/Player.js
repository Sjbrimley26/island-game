import { roll_the_dice, lucky_roll } from "./Logic";
import itemDB from "./ItemLibrary";

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function createPlayer(sprite, { ...args }) {
  let player = {
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

    changeSanity(amount) {
      //amount should be between -1 and 1
      this.sanity = (this.sanity * 10 + amount * 10) / 10;
      if (this.sanity > 1) {
        this.sanity = 1;
      }
      if (this.sanity < 0) {
        this.sanity = 0;
      }
    },

    changeLuck(amount) {
      //a luck of .5 rolling a 100-sided die will have a range of 50 - 150, that seems like a good range to me
      //so this amount should be between -.5 and .5, though I suppose it could be 1 for a complete flip
      //so all odds in this game will fall between -49% and 150%
      this.luck = (this.luck * 10 + amount * 10) / 10;
      if (this.luck > 0.5) {
        this.luck = 0.5;
      }
      if (this.luck < -0.5) {
        this.luck = -0.5;
      }
    },

    normalizeLuck() {
      const diff = Math.abs(this.luck) * 10 - 10;
      if (this.luck > 1) {
        this.changeLuck(-Math.round(diff * 10 / 3) / 10);
      } else {
        this.changeLuck(Math.round(diff * 10 / 3) / 10);
      }
    },

    goInsane() {
      this.sanity = 1;
      this.addStatusEffect("stunned");
    },

    pickUpItem(item) {
      this.inventory.push({ ...item });
      let tempItem = this.getPlayerItem(item.name);
      if (item.initialCharges !== 1) {
        if (lucky_roll(100, this) < 85) {
          tempItem.setCharges(getRandomInt(tempItem.charges));
        }
      }
    },

    useItem(name) {
      const the_item = this.getPlayerItem(name);
      if (
        the_item !== undefined &&
        (!this.hasUsedItem || (the_item.isFree && !the_item.hasBeenUsed))
      ) {
        this.triggerItemEffect(the_item);
        if (the_item.charges === 0) {
          const deleted_index = this.inventory.findIndex(item => {
            item.name === the_item.name;
          });
          if (deleted_index !== -1) {
            this.inventory.splice(deleted_index, 1);
          }
        }
      }
    },

    triggerItemEffect(item) {
      item.use();
      this.hasUsedItem = item.isFree ? false : true;
      let diceRoll = lucky_roll(100, this);
      const target = item.targetsEnemy ? this.selectTarget() : null;
      const itemIndex = item.targetsItem ? this.selectItem(item.name) : null;
      const targetTile = item.targetsTile ? this.selectTile() : null;

      switch (item.name) {
        case "rabbit foot":
          this.changeLuck(0.07);
          break;

        case "coin of fate":
          if (roll_the_dice(2) === 1) {
            this.changeLuck(-0.1);
          } else {
            this.changeLuck(0.1);
          }
          break;

        case "dark orb":
          if (diceRoll < 10) {
            //critical failure
            this.changeLuck(0.5);
            this.addStatusEffect("paralyzed");
          } else if (diceRoll < 50) {
            //fail
            this.changeLuck(0.03);
            this.changeSanity(-0.2);
          } else if (diceRoll >= 98) {
            //critical success
            this.changeLuck(-2);
            //something amazing I guess
          } else {
            //something cool
            this.changeSanity(-0.1);
          }
          break;

        case "cursed portal":
          if (this.sanity < 0.5) {
            //no effect
            item.charges++;
          } else {
            //give player choice to go to somewhere
            //that choice will return an x, y coordinate

            //choose_target should trigger a click effect,
            //like making all the tiles clickable and on click
            //the clicked tile's x and y is returned
            this.changeSanity(-1);
          }
          break;

        case "magic batteries":
          this.inventory[itemIndex].addCharges(2);
          break;

        case "gelatinous mass":
          let rarity =
            diceRoll < 33
              ? "common"
              : diceRoll >= 33 && diceRoll <= 85 ? "uncommon" : "rare";
          this.transmuteItem("gelatinous mass", rarity);
          break;

        case "draw two":
          if (diceRoll < 50) {
            this.pickUpItem(itemDB.getRandomCommon());
          } else {
            this.addStatusEffect("draw 1 uncommon"); //You get it the next turn so it won't be discarded :)
          }
          this.pickUpItem(itemDB.getRandomCommon());
          break;

        case "draw four":
          for (let x = 0; x < 4; x++) {
            target.pickUpItem(itemDB.getItem("rock"));
          }
          this.changeLuck(-0.03); //Bad karma lol
          this.changeSanity(-0.1);
          break;

        case "rock":
          if (item.charges !== 0) {
            console.log(
              "You try to throw away the rock but it reappears in your pocket"
            );
          }
          break;
        //The two previous items takes advantage of the fact that you can't choose which items to discard

        case "lucky lasso":
          this.stealRandomItem(target);
          break;

        case "jack in the box":
          targetTile.addEffect("scare 0.5");
          break;

        case "felix felicis":
          this.changeLuck(1); //Lucky one turn
          this.addStatusEffect("karma -0.6"); //Unlucky the next
          break;
      }
    },

    stealRandomItem(player) {
      if (player.inventory.length > 0) {
        const luckyDiff = lucky_roll(100, this) - lucky_roll(100, player);
        let stolenItem;
        if (luckyDiff > 0) {
          stolenItem = player.inventory.splice(
            getRandomInt(player.inventory.length),
            1
          );
        } else {
          let luckyIndex;
          luckyIndex = player.inventory.findIndex(item => {
            item.rarity === "common";
          });
          if (luckyIndex === -1) {
            luckyIndex = this.inventory.findIndex(item => {
              item.rarity === "uncommon"; //or an uncommon if there are no commons
            });
          }
          if (luckyIndex !== -1) {
            stolenItem = player.inventory.splice(luckyIndex, 1);
          } else {
            //if they roll luckier than you, you can only steal a common or an uncommon
            //otherwise you don't steal anything
            return;
          }
        }
        this.pickUpItem(stolenItem[0]);
      }
    },

    tradeItem(player, giveIndex, takeIndex) {
      if (player.inventory.length > 0) {
        let itemToGive;
        let itemToTake;

        if (giveIndex) {
          itemToGive = this.inventory.splice(giveIndex, 1);
        } else {
          itemToGive = this.inventory.splice(
            getRandomInt(this.inventory.length),
            1
          );
        }

        if (takeIndex) {
          itemToTake = player.inventory.splice(takeIndex, 1);
        } else {
          itemToTake = player.inventory.splice(
            getRandomInt(player.inventory.length),
            1
          );
        }

        this.pickUpItem(itemToTake[0]);
        player.pickUpItem(itemToGive[0]);
      }
    },

    //TODO Select functions
    //I'm thinking it will use the game's playermap
    //and tilemap somehow

    selectTarget() {
      //First Select an Enemy Target
      return enemy;
    },

    selectItem(exclusion) {
      //added exclusion so items can't select themselves (e.g. can't use magic batteries to add charges  to itself)
      //Select an item to Affect
      let selected_item;
      return this.inventory.indexOf(selected_item);
    },

    selectTile() {
      //Select a tile
      return tile;
    },

    addStatusEffect(effect) {
      if (this.status.indexOf(effect) === -1) {
        this.status.push(effect);
      }
    },

    triggerStatusEffect(effect) {
      let effectArr = effect.split(" ");
      if (effectArr.length === 1) {
        switch (effect) {
          case "stunned":
            this.hasMoved = true;
            this.hasUsedItem = true;
            if (this.sanity < 1) {
              this.changeLuck(0.02);
            }
            break;

          case "trapped":
            this.hasMoved = true;
            break;

          case "tied":
            this.hasUsedItem = true;
            break;

          case "paralyzed":
            this.hasMoved = true;
            this.hasUsedItem = true;
            this.inventory.forEach(item => {
              if (item.isFree) {
                item.hasBeenUsed = true;
              }
            });
            this.changeLuck(0.05);
            break;
        }
      } else {
        switch (effectArr[0]) {
          case "draw": // so you could do "draw 2" for example
            for (let i = 0; i < parseInt(effectArr[1]); i++) {
              if (effectArr[2]) {
                // or "draw 2 common"
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
              } else {
                this.pickUpItem(itemDB.getRandomItem());
              }
            }
            break;

          case "random":
            if (effectArr[1] === "recharge") {
              this.rechargeItem(
                this.inventory[getRandomInt(this.inventory.length)]
              );
            }
            break;

          case "scare":
            this.changeSanity(-parseFloat(effectArr[1]));
            break;

          case "karma":
            this.changeLuck(parseFloat(effectArr[1]));
            break;
        }
      }
    },

    rechargeItem(item) {
      const the_item = this.getPlayerItem(item.name);
      if (the_item !== undefined) {
        if (the_item.charges < the_item.initialCharges) {
          the_item.setCharges(item.initialCharges);
        }
      }
    },

    transmuteItem(name, optionalRarity) {
      //Removes an item from your inventory and returns a different one of the same rarity
      const the_item = this.getPlayerItem(name);
      if (the_item !== undefined) {
        const itemIndex = this.inventory.indexOf(the_item);
        let rarity;
        if (optionalRarity) {
          rarity = optionalRarity;
        } else {
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

    getPlayerItem(name) {
      const the_item = this.inventory.find(function(element) {
        return element.name === name;
      });
      return the_item;
    },

    onStartTurn() {
      this.turn += 1;
      this.hasUsedItem = false;
      this.hasMoved = false;

      if (Math.abs(this.luck) - 1 > 0.3) {
        this.normalizeLuck(); //So if a player has high or low luck, it decreases a bit at the start
        //of each turn.
      }

      if (this.sanity === 0) {
        this.goInsane();
      }

      if (this.turn >= 5) {
        let diceRoll = lucky_roll(100, this);
        let item = diceRoll < 10 ? "rock" : diceRoll > 90 ? "rare" : "uncommon";
        item === "rock"
          ? this.pickUpItem(itemDB.getItem("rock"))
          : item === "rare"
            ? this.pickUpItem(itemDB.getRandomRare())
            : this.pickUpItem(itemDB.getRandomUnommon());
      }
      this.pickUpItem(itemDB.getRandomCommon());

      this.status.forEach(effect => {
        this.triggerStatusEffect(effect);
      });
      this.status = [];

      this.active = true;
    },

    onEndTurn() {
      if (this.inventory.length > 6) {
        do {
          if (lucky_roll(100, this) >= 75) {
            //IF LUCKY
            let luckyIndex = this.inventory.findIndex(item => {
              item.name === "rock"; //gets rid of rocks first
            });
            if (luckyIndex === -1) {
              luckyIndex = this.inventory.findIndex(item => {
                item.rarity === "common"; //or a common if there are no rocks
              });
            }
            if (luckyIndex === -1) {
              luckyIndex = this.inventory.findIndex(item => {
                item.rarity === "uncommon"; //or an uncommon if there are no commons
              });
            }
            if (luckyIndex === -1) {
              luckyIndex = this.inventory.findIndex(item => {
                item.rarity === "rare"; //or a rare if there are no uncommons
              });
            }
            this.inventory.splice(luckyIndex, 1);
          } else {
            //IF UNLUCKY
            this.inventory.splice(getRandomInt(this.inventory.length), 1);
          }
        } while (this.inventory.length > 6);
      }

      this.inventory.forEach(item => {
        if (item.isFree) {
          item.hasBeenUsed = false;
        }
      });

      this.active = false;
    }
  };
  return { ...sprite, ...player };
}

module.exports = {
  createPlayer,
  getRandomInt
};
