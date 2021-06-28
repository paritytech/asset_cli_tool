const { getKeypair, getApi, signAndSend } = require("../setup");
const inquirer = require("inquirer");
const { adjustAmount } = require("./helpers/adjustAmount");

const question = [
  {
    type: "input",
    name: "id",
    message: "input asset id",
    default: "1",
  },
  {
    type: "input",
    name: "from",
    message: "sending from mnemonic",
    default: "//Alice",
  },
  {
    type: "input",
    name: "to",
    message: "send to address",
    default: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
  },
  {
    type: "input",
    name: "amount",
    message: "Input amount (will be multiplied by decimals)",
    default: "1",
  },
];

const transfer = async (calls) => {
  const { id, to, amount, from } = await inquirer.prompt(question);
  const api = await getApi();
  const sender = getKeypair(from);
  const tx = await calls.transfer(api, [id, to, amount]);
  await signAndSend(tx, api, sender);
};

module.exports = {
  transfer,
};
