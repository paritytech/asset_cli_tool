const { getKeypair, getApi, signAndSend, ledgerSignAndSend } = require('../setup');
const inquirer = require('inquirer');

const question = [
  {
    type: 'input',
    name: 'id',
    message: 'input asset id to thaw',
    default: '1',
  },
  {
    type: 'input',
    name: 'thawer',
    message: 'input thawer mnemonic (type ledger to use Ledger)',
    default: '//Alice',
  },
];

const thawAsset = async (calls) => {
  const { id, thawer } = await inquirer.prompt(question);
  const api = await getApi();
  const tx = await calls.thawAsset(api, [id]);
  if (thawer === 'ledger') {
    await ledgerSignAndSend(tx, api);
  } else {
    const sender = getKeypair(thawer);
    await signAndSend(tx, api, sender);
  }
};

module.exports = {
  thawAsset,
};
