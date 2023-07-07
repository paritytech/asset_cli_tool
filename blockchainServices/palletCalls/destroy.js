const { getKeypair, getApi, signAndSendWithNonce, signAndSendWithNonceAndExit, ledgerSignAndSendWithNonce, ledgerSignAndSendWithNonceAndExit } = require("../setup");
const inquirer = require("inquirer");

const question = [
  {
    type: "input",
    name: "id",
    message: "input asset id",
    default: "1"
  },
  {
    type: "input",
    name: "admin",
    message: "input admin mnemonic ledger for ledger",
    default: "//Alice",
  },
  {
    type: "input",
    name: "freezer",
    message: "input freezer mnemonic ledger for ledger",
    default: "//Alice",
  }
];

const destroy = async (calls) => {
  const { id, admin, freezer } = await inquirer.prompt(question);
  const api = await getApi();
  if (admin === "ledger") {
    const tx_0 = await calls.freezeAsset(api, [id])
    await ledgerSignAndSendWithNonce(tx_0, api)
    const tx_1 = await calls.startDestroy(api, [id])
    await ledgerSignAndSendWithNonce(tx_1, api)
    const tx_2 = await calls.destroyAccounts(api, [id])
    await ledgerSignAndSendWithNonce(tx_2, api)
    const tx_3 = await calls.destroyApprovals(api, [id])
    await ledgerSignAndSendWithNonce(tx_3, api)
    const tx_4 = await calls.finishDestroy(api, [id])
    await ledgerSignAndSendWithNonceAndExit(tx_4, api)
  } else {
    const freezerPair = getKeypair(freezer);
    const tx_0 = await calls.freezeAsset(api, [id])
    await signAndSendWithNonce(tx_0, api, freezerPair)
    const sender = getKeypair(admin)
    const tx_1 = await calls.startDestroy(api, [id])
    await signAndSendWithNonce(tx_1, api, sender)
    const tx_2 = await calls.destroyAccounts(api, [id])
    await signAndSendWithNonce(tx_2, api, sender)
    const tx_3 = await calls.destroyApprovals(api, [id])
    await signAndSendWithNonce(tx_3, api, sender)
    const tx_4 = await calls.finishDestroy(api, [id])
    await signAndSendWithNonceAndExit(tx_4, api, sender)
  }
};

module.exports = {
  destroy,
};
