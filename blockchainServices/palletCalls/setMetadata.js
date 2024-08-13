const { getKeypair, getApi, signAndSend, ledgerSignAndSend } = require('../setup');
const inquirer = require('inquirer');

const question = [
  {
    type: 'input',
    name: 'id',
    message: 'input asset id',
    default: '1',
  },
  {
    type: 'input',
    name: 'name',
    message: 'Token name',
    default: 'test',
  },
  {
    type: 'input',
    name: 'symbol',
    message: 'Token symbol',
    default: 'test',
  },
  {
    type: 'input',
    name: 'decimals',
    message: 'Token decimals',
    default: '12',
  },
  {
    type: 'input',
    name: 'admin',
    message: 'admin for the asset (type ledger to use Ledger Generic App, type migration to use Ledger Migration App)',
    default: '//Alice',
  },
];

const setMetadata = async (calls) => {
  const { id, admin, name, symbol, decimals } = await inquirer.prompt(question);
  const api = await getApi();
  const tx = await calls.setMetadata(api, [id, name, symbol, decimals]);
  if (admin === 'ledger') {
    await ledgerSignAndSend(tx, api)
  } else if (admin === 'migration') {
    await ledgerSignAndSend(tx, api, true)
  } else {
    const sender = getKeypair(admin);
    await signAndSend(tx, api, sender)
  }};

module.exports = {
  setMetadata,
};
