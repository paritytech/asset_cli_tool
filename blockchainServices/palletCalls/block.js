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
    message: 'account to block',
    default: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
  },
  {
    type: 'input',
    name: 'blocker',
    message: 'freezer for the asset (type ledger to use Ledger Generic App, type migration to use Ledger Migration App)',
    default: '//Alice' 
  }
];

const block = async (calls) => {
  const {id, who, blocker} = await inquirer.prompt(question)
  const api = await getApi();
  const tx = await calls.block(api, [id, who])
  if (blocker === 'ledger') {
    await ledgerSignAndSend(tx, api)
  } else if (blocker === 'migration') {
    await ledgerSignAndSend(tx, api, true)
  } else {
    const sender = getKeypair(blocker);
    await signAndSend(tx, api, sender)
  }};

module.exports = {
  block,
};
