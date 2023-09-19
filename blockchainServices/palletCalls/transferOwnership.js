const {
  getKeypair,
  getApi,
  signAndSend,
  ledgerSignAndSend,
} = require("../setup");
const inquirer = require("inquirer");

const question = [
  {
    type: "input",
    name: "id",
    message: "input asset id",
    default: "1",
  },
  {
    type: "input",
    name: "admin",
    message: "input current owner mnemonic type ledger for ledger",
    default: "//Alice",
  },
  {
    type: "input",
    name: "owner",
    message: "Input new Owner address",
    default: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  },
];

const transferOwnership = async (calls) => {
  const { id, admin, owner } = await inquirer.prompt(question);
  const api = await getApi();
  const tx = await calls.transferOwnership(api, [id, owner]);
  if (admin === "ledger") {
    await ledgerSignAndSend(tx, api);
  } else {
    const sender = getKeypair(admin);
    await signAndSend(tx, api, sender);
  }
};

module.exports = {
  transferOwnership,
};
