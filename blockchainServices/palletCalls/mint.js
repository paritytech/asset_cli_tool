const { getKeypair, getApi, signAndSend, ledgerSignAndSend } = require('../setup');
const inquirer = require('inquirer');
const question = [
  {
    type: 'input',
    name: 'id',
    message: 'input asset id',
    default: '1'
  },
  {
    type: 'input',
    name: 'beneficiary',
    message: 'send to address',
    default: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
  },
  {
    type: 'input',
    name: 'amount',
    message: 'Input amount',
    default: '1'
  },
  {
      type: 'input',
      name: 'issuer',
      message: 'issuer for the asset (type ledger to use Ledger Generic App, type migration to use Ledger Migration App)',
      default: '//Alice'
  }
];

const mint = async (calls) => {
  const {id, beneficiary, amount, issuer} = await inquirer.prompt(question)
  const api = await getApi();
  const tx = await calls.mint(api, [id, beneficiary, amount])
  if (issuer === 'ledger') {
    await ledgerSignAndSend(tx, api)
  } else if (issuer === 'migration') {
    await ledgerSignAndSend(tx, api, true)
  } else {
    const sender = getKeypair(issuer);
    await signAndSend(tx, api, sender)
  }
};

module.exports = {
  mint,
};
