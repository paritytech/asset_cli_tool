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
    name: 'owner',
    message: 'input account to spend from',
    default: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
  },
  {
    type: 'input',
    name: 'delegate',
    message: 'input account to spend',
    default: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
  },
];

const approvals = async () => {
    const { id, owner, delegate } = await inquirer.prompt(question);
    const api = await getApi()
    const accountInfo = await api.query.assets.approvals(Number(id), {owner, delegate})
    console.log({accountInfo: accountInfo.toHuman()})
    process.exit()
}

module.exports = {
    approvals
}