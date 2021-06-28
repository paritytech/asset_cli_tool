const { getKeypair, getApi, signAndSend } = require("../setup");
const inquirer = require("inquirer");
const { adjustAmount } = require("./helpers/adjustAmount");

const question = [
  {
    type: "input",
    name: "id",
    message: "input asset id",
    default: '1'
  },
  {
      type: 'input',
      name: 'from',
      message: 'sending from mnemonic',
      default: '//Bob' 
  },
  {
    type: "input",
    name: "delegate",
    message: "delegate to address",
    default: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
  },
  {
    type: 'input',
    name: 'amount',
    message: "Input amount (will be multiplied by decimals)",
    default: "1"
  },
];

const approveTransfer = async (calls) => {
  const {id, delegate, amount, from} = await inquirer.prompt(question)
  const api = await getApi();
  const sender = getKeypair(from);
  const tx = await calls.approveTransfer(api, [id, delegate, amount])
  await signAndSend(tx, api, sender)  
};

module.exports = {
  approveTransfer,
};
