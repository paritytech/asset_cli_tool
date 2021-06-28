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
    message: "sending tokens from",
    default: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
  },
  {
    type: "input",
    name: "to",
    message: "send to address",
    default: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  },
  {
    type: "input",
    name: "amount",
    message: "Input amount (will be multiplied by decimals)",
    default: "1",
  },
  {
    type: "input",
    name: "origin",
    message: "mnemonic sending from",
    default: "//Alice",
  },
];

const transferApproved = async (calls) => {
  const { id, to, amount, from, origin } = await inquirer.prompt(question);
  const api = await getApi();
  const sender = getKeypair(origin);
  const tx = await calls.transferApproved(api, [id, from, to, amount]);
  await signAndSend(tx, api, sender);
};

module.exports = {
  transferApproved,
};
