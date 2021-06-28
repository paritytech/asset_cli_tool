const { getKeypair, getApi, signAndSend } = require("../setup");
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
    name: "currentOwner",
    message: "input current owner mnemonic",
    default: "//Alice",
  },
  {
    type: "input",
    name: "newOwner",
    message: "Input new Owner address",
    default: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  },
];

const transferOwnership = async (calls) => {
  const { id, currentOwner, newOwner } = await inquirer.prompt(question);
  const api = await getApi();
  const sender = getKeypair(currentOwner);
  const tx = await calls.transferOwnership(api, [id, newOwner]);
  await signAndSend(tx, api, sender);
};

module.exports = {
  transferOwnership,
};
