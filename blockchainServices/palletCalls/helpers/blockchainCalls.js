const { adjustAmount } = require("./adjustAmount");

class Calls {
  async mint(api, args) {
    console.log({args})
    const adjustedAmount = await adjustAmount(api, args[0], args[2]);
    return api.tx.assets.mint(Number(args[0]), args[1], adjustedAmount);
  }
}

module.exports = {
  Calls,
};
