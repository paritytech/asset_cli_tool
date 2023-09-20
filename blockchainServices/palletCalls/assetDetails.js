const { getApi } = require('../setup');
const inquirer = require('inquirer');

const question = [
  {
    type: 'input',
    name: 'id',
    message: 'input asset id',
    default: '1'
  },
];

const assetDetails = async () => {
    const { id } = await inquirer.prompt(question);
    const api = await getApi()
    const assetInfo = await api.query.assets.asset(Number(id))
    console.log({assetInfo: assetInfo.toHuman()})
    process.exit()
}

module.exports = {
    assetDetails
}
