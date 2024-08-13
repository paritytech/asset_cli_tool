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
    message: 'account to be created',
    default: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
  },
  {
      type: 'input',
      name: 'creator',
      message: 'admin or freezer for the asset (type ledger to use Ledger Generic App, type migration to use Ledger Migration App)',
      default: '//Alice' 
  }
];

const touchOther = async (calls) => {
  const {id, who, creator} = await inquirer.prompt(question)
  const api = await getApi();
  const tx = await calls.touchOther(api, [id, who])
  if (admin === 'ledger') {
    await ledgerSignAndSend(tx, api)
  } else if (admin === 'migration') {
    await ledgerSignAndSend(tx, api, true)
  } else {
    const sender = getKeypair(creator);
    await signAndSend(tx, api, sender)
  }};

module.exports = {
  touchOther,
};
