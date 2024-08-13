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
    name: 'who',
    message: 'burn tokens from',
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
    name: 'admin',
    message: 'admin for the asset (type ledger to use Ledger Generic App, type migration to use Ledger Migration App)',
    default: '//Alice' 
  }
];

const burn = async (calls) => {
  const {id, who, amount, admin} = await inquirer.prompt(question)
  const api = await getApi();
  const tx = await calls.burn(api, [id, who, amount])
  if (admin === 'ledger') {
    await ledgerSignAndSend(tx, api)
  } else if (admin === 'migration') {
    await ledgerSignAndSend(tx, api, true)
  } else {
    const sender = getKeypair(admin);
    await signAndSend(tx, api, sender)
  }};

module.exports = {
  burn,
};
