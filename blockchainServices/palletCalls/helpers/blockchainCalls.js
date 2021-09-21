const { adjustAmount } = require("./adjustAmount");

class Calls {
  async approveTransfer(api, args) {
    const adjustedAmount = await adjustAmount(api, args[0], args[2]);
    console.log({ args, adjustedAmount });
    return api.tx.assets.approveTransfer(
      Number(args[0]),
      args[1],
      adjustedAmount
    );
  }

  async burn(api, args) {
    const adjustedAmount = await adjustAmount(api, args[0], args[2]);
    console.log({ args, adjustedAmount });
    return api.tx.assets.burn(Number(args[0]), args[1], adjustedAmount);
  }

  async cancelApproval(api, args) {
    console.log({ args });
    return api.tx.assets.cancelApproval(Number(args[0]), args[1]);
  }

  async clearMetadata(api, args) {
    console.log({ args });
    return api.tx.assets.clearMetadata(Number(args[0]));
  }

  async createAsset(api, args) {
    console.log({ args });
    return api.tx.assets.create(Number(args[0]), args[1], Number(args[2]));
  }

  async destroy(api, args) {
    const assetInfo = await api.query.assets.asset(Number(args[0]));
    console.log({ args, assetInfo });
    return api.tx.assets.destroy(Number(args[0]), assetInfo);
  }

  async forceTransfer(api, args) {
    const adjustedAmount = await adjustAmount(api, args[0], args[3]);
    console.log({ args, adjustedAmount });
    return api.tx.assets.forceTransfer(
      Number(args[0]),
      args[1],
      args[2],
      adjustedAmount
    );
  }

  async freeze(api, args) {
    console.log({ args });
    return api.tx.assets.freeze(Number(args[0]), args[1]);
  }

  async freezeAsset(api, args) {
    console.log({ args });
    return api.tx.assets.freezeAsset(Number(args[0]));
  }

  async mint(api, args) {
    const adjustedAmount = await adjustAmount(api, args[0], args[2]);
    console.log({ args, adjustedAmount });
    return api.tx.assets.mint(Number(args[0]), args[1], adjustedAmount);
  }

  async setMetadata(api, args) {
    console.log({ args });
    return api.tx.assets.setMetadata(
      Number(args[0]),
      args[1],
      args[2],
      args[3]
    );
  }

  async setTeam(api, args) {
    console.log({ args });
    return api.tx.assets.setTeam(Number(args[0]), args[1], args[2], args[3]);
  }

  async thaw(api, args) {
    console.log({ args });
    return api.tx.assets.thaw(Number(args[0]), args[1]);
  }

  async thawAsset(api, args) {
    console.log({ args });
    return api.tx.assets.thawAsset(Number(args[0]));
  }

  async transfer(api, args) {
    const adjustedAmount = await adjustAmount(api, args[0], args[2]);
    console.log({ args, adjustedAmount });
    return api.tx.assets.transfer(Number(args[0]), args[1], adjustedAmount);
  }

  async transferApproved(api, args) {
    const adjustedAmount = await adjustAmount(api, args[0], args[3]);
    console.log({ args, adjustedAmount });
    return api.tx.assets.transferApproved(
      Number(args[0]),
      args[1],
      args[2],
      adjustedAmount
    );
  }

  async transferKeepAlive(api, args) {
    const adjustedAmount = await adjustAmount(api, args[0], args[2]);
    console.log({ args, adjustedAmount });
    return api.tx.assets.transferKeepAlive(
      Number(args[0]),
      args[1],
      adjustedAmount
    );
  }

  async transferOwnership(api, args) {
    console.log({ args });
    return api.tx.assets.transferOwnership(Number(args[0]), args[1]);
  }

  async transferNative(api, args) {
    console.log({ args });
    return api.tx.balances.transfer(args[0], args[1]);
  }

  async batchBurn(api, args) {
    const thaw = await this.thaw(api, args)
    const burn = await this.burn(api, args)
    const freeze = await this.freeze(api, args)
    return api.tx.utility.batchAll([thaw, burn, freeze])
  }
}

module.exports = {
  Calls,
};
