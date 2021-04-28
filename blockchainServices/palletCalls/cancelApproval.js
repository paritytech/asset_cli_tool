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
];

const cancelApproval = async () => {
  const {id, delegate, from} = await inquirer.prompt(question)
  const api = await getApi();
  console.log({id, delegate, from})
  const sender = getKeypair(from);
  const tx = api.tx.assets
      .cancelApproval(Number(id), delegate)
  await signAndSend(tx, api, sender)
};

module.exports = {
  cancelApproval,
};
