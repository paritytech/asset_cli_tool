const { getKeypair, getApi, signAndSend } = require("../setup");
const inquirer = require("inquirer");
const { adjustAmount } = require("./helpers/adjustAmount");
const {Calls} = require("./helpers/blockchainCalls")
const question = [
  {
    type: "input",
    name: "id",
    message: "input asset id",
    default: '1'
  },
  {
    type: "input",
    name: "to",
    message: "send to address",
    default: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
  },
  {
    type: 'input',
    name: 'amount',
    message: "Input amount",
    default: "1"
  },
  {
      type: 'input',
      name: 'admin',
      message: 'admin for the asset',
      default: '//Alice'
  }
];

const mint = async (calls) => {
  const {id, to, amount, admin} = await inquirer.prompt(question)
  const api = await getApi();
  console.log({id, to, amount})
  const sender = getKeypair(admin);
  console.log({calls})
  const tx = await calls.mint(api, [id, to, amount])
  console.log({tx})
  await signAndSend(tx, api, sender)
};

module.exports = {
  mint,
};
