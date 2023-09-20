const { getApi } = require('../setup');
const inquirer = require('inquirer');

const question = [
  {
    type: 'input',
    name: 'address',
    message: 'input address',
    default: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
  },
];

const nativeBalance = async () => {
    const { address } = await inquirer.prompt(question);
    const api = await getApi()
    const balance = await api.query.system.account(address)
    console.log({assetInfo: balance.toHuman()})
    process.exit()
}

module.exports = {
    nativeBalance
}