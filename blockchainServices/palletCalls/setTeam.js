const { getKeypair, getApi, signAndSend } = require("../setup");
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
    name: "currentAdmin",
    message: "input current admin mnemonic",
    default: "//Alice",
  },
  {
    type: "input",
    name: "newAdmin",
    message: "Input new Admin address",
    default: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  },
  {
    type: "input",
    name: "newIssuer",
    message: "Input new Issuer address",
    default: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  },
  {
    type: "input",
    name: "newFreezer",
    message: "Input new Freezer address",
    default: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  },
];

const setTeam = async () => {
  const { id, currentAdmin, newIssuer, newAdmin, newFreezer } = await inquirer.prompt(question);
  console.log({id, currentAdmin, newIssuer, newAdmin, newFreezer});
  const api = await getApi();
  const sender = getKeypair(currentAdmin);
  const tx = api.tx.assets
    .setTeam(Number(id), newIssuer, newAdmin, newFreezer)
  await signAndSend(tx, api, sender)
};

module.exports = {
  setTeam,
};
