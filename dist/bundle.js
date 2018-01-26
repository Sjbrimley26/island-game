/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Item = __webpack_require__(4);

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

var rabbit_foot = (0, _Item.createChargedItem)("rabbit foot", "common");
var fate_coin = (0, _Item.createChargedItem)("coin of fate", "uncommon", 3);
var dark_orb = (0, _Item.createChargedItem)("dark orb", "rare", 4);
var cursed_portal = (0, _Item.createChargedItem)("cursed portal", "rare");

var itemList = [rabbit_foot, fate_coin, dark_orb, cursed_portal];

var commonsList = itemList.filter(function (item) {
  return item.rarity === "common";
});
var uncommonsList = itemList.filter(function (item) {
  return item.rarity === "uncommon";
});
var raresList = itemList.filter(function (item) {
  return item.rarity === "rare";
});

var itemDB = {
  itemList: itemList,
  commonsList: commonsList,
  raresList: raresList,
  uncommonsList: uncommonsList,

  getRandomCommon: function getRandomCommon() {
    return this.commonsList[getRandomInt(this.commonsList.length)];
  },
  getRandomUncommon: function getRandomUncommon() {
    return this.uncommonsList[getRandomInt(this.uncommonsList.length)];
  },
  getRandomRare: function getRandomRare() {
    return this.raresList[getRandomInt(this.raresList.length)];
  },
  getRandomItem: function getRandomItem() {
    return this.itemList[getRandomInt(this.itemList.length)];
  },
  getItem: function getItem(name) {
    return this.itemList.find(function (item) {
      return item.name === name;
    });
  }
};

exports.default = itemDB;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Player = __webpack_require__(2);

var _ItemLibrary = __webpack_require__(0);

var _ItemLibrary2 = _interopRequireDefault(_ItemLibrary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var player1 = (0, _Player.createPlayer)({ id: 1, name: "Spencer" });
player1.pickUpItem(_ItemLibrary2.default.getRandomCommon());
player1.pickUpItem(_ItemLibrary2.default.getItem("dark orb"));
player1.transmuteItem(_ItemLibrary2.default.getItem("dark orb"));

for (var i = 0; i < 20; i++) {
  console.log(_ItemLibrary2.default.getRandomRare());
}

console.dir(player1.inventory);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Logic = __webpack_require__(3);

var _ItemLibrary = __webpack_require__(0);

var _ItemLibrary2 = _interopRequireDefault(_ItemLibrary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function createPlayer(_ref) {
  var args = _objectWithoutProperties(_ref, []);

  return {
    luck: 0,
    sanity: 1,
    inventory: [],
    id: args.id,
    name: args.name,
    active: false,

    changeSanity: function changeSanity(amount) {
      //amount should be between -1 and 1
      this.sanity = (this.sanity * 10 + amount * 10) / 10;
      if (this.sanity > 1) {
        this.sanity = 1;
      }
      if (this.sanity < 0) {
        this.sanity = 0;
      }
    },
    changeLuck: function changeLuck(amount) {
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
    pickUpItem: function pickUpItem(item) {
      var the_item = this.inventory.find(function (element) {
        return element.name === item.name;
      });
      if (the_item === undefined) {
        this.inventory.push(Object.assign({}, item));
      } else {
        the_item.charge += item.charge;
      }
    },
    useItem: function useItem(item) {
      //the item used as the argument should be the name of the item
      //this is because the player is not actually holding the object,
      //but a clone of the object, so finding it by name makes sense.
      var the_item = this.inventory.find(function (element) {
        return element.name === item;
      });
      if (the_item !== undefined) {
        this.triggerEffect(this, the_item);
        if (the_item.charge === 0) {
          var deleted_index = this.inventory.indexOf(the_item); //Should I delete the item
          this.inventory.splice(deleted_index, 1); //or leave it in the inventory
        } //with no charges?
      }
    },
    triggerEffect: function triggerEffect(player, item) {
      item.use();

      switch (item.name) {

        case "rabbit foot":
          player.changeLuck(.07);
          break;

        case "coin of fate":
          if ((0, _Logic.roll_the_dice)(2) === 1) {
            player.changeLuck(-.1);
          } else {
            player.changeLuck(.1);
          }
          break;

        case "dark orb":
          if ((0, _Logic.lucky_roll)(100, player) < 10) {
            //critical failure
            player.changeLuck(.5);
            player.changeSanity(-1);
          } else if ((0, _Logic.lucky_roll)(100, player) < 50) {
            //fail
            player.changeLuck(.03);
            player.changeSanity(-.2);
          } else if ((0, _Logic.lucky_roll)(100, player) >= 100) {
            //critical success
            player.changeLuck(-2);
            //something amazing I guess
          } else {
            //something cool
            player.changeSanity(-.1);
          }
          break;

        case "cursed portal":
          if (player.sanity < .5) {
            //no effect
            item.charge++;
          } else {
            //give player choice to go to somewhere
            //that choice will return an x, y coordinate

            //choose_target should trigger a click effect,
            //like making all the tiles clickable and on click
            //the clicked tile's x and y is returned
            player.changeSanity(-2);
          }
          break;
      }
    },
    rechargeItem: function rechargeItem(item) {
      var the_item = this.inventory.find(function (element) {
        return element.name === item;
      });
      if (the_item !== undefined) {
        the_item.setCharges(item.charges);
      }
    },
    transmuteItem: function transmuteItem(item) {
      //Removes an item from your inventory and returns a new one of the same rarity
      var the_item = this.inventory.find(function (element) {
        return element.name === item;
      });
      if (the_item !== undefined) {
        var itemIndex = this.inventory.indexOf(the_item);
        var rarity = the_item.rarity;
        switch (rarity) {
          case "common":
            this.inventory.splice(itemIndex, 1);
            this.pickUpItem(_ItemLibrary2.default.getRandomCommon());
            break;
          case "uncommon":
            this.inventory.splice(itemIndex, 1);
            this.pickUpItem(_ItemLibrary2.default.getRandomCommon());
            break;
          case "rare":
            this.inventory.splice(itemIndex, 1);
            this.pickUpItem(_ItemLibrary2.default.getRandomRare());
            break;
        }
      }
    }
  };
};

module.exports = {
  createPlayer: createPlayer
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function roll_the_dice(sides) {
  return Math.floor(Math.random() * sides) + 1;
};

//same as above, but player's luck factors in
//player's luck should be a number between -1 and 1
function lucky_roll(sides, player) {
  return Math.floor((Math.random() + player.luck) * sides) + 1;
};

module.exports = {
  roll_the_dice: roll_the_dice,
  lucky_roll: lucky_roll
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function createItem(name, rarity) {
  return {
    name: name,
    rarity: rarity,
    use: function use() {
      if (this.hasOwnProperty("charges")) {
        if (this.charges > 0) {
          //Something AMAZING, I guess
          this.charges--;
        }
      }
      //Normal "Use" Case
      console.log(this.name + " was used");
    }
  };
};

function withCharges(item) {
  return _extends({}, item, {
    "charges": 1,
    setCharges: function setCharges(charges) {
      this.charges = charges;
    }
  });
};

function createChargedItem(name, rarity) {
  var charges = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  var item = withCharges(createItem(name, rarity));
  if (charges !== 1) {
    item.setCharges(charges);
  }
  return item;
};

module.exports = {
  createItem: createItem,
  withCharges: withCharges,
  createChargedItem: createChargedItem
};

/***/ })
/******/ ]);