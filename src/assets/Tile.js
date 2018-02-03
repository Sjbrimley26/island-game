function createTile(args) {
  return {
    ...args,
    effects: [],
    addEffect(effect) {
      let effectArr = effect.split(" ");
      let currentEffects = this.status.map(effects => {
        let miniArr = effects.split(" ");
        return miniArr[0];
      });
      if (currentEffects.includes(effectArr[0])) {
        //Only one effect of each type
        return; //First comes first
      }
      return this.effects.push(effect);
    },
    onPlayerArrival(player) {
      this.effects.forEach(effect => {
        player.addStatusEffect(effect);
      });
      this.effects = [];
    }
  };
}
