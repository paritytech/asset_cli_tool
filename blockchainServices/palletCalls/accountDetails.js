const { getApi } = require('../setup');
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
    name: 'account',
    message: 'input account to check',
    default: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
  },
];

const accountDetails = async () => {
    const { id, account } = await inquirer.prompt(question);
    const api = await getApi()
    const accountInfo = await api.query.assets.account(Number(id), account)
    console.log({accountInfo: accountInfo.toHuman()})
    process.exit()
}

module.exports = {
    accountDetails
}