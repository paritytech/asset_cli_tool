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

const assetMetadata = async () => {
    const { id } = await inquirer.prompt(question);
    const api = await getApi()
    const metadata = await api.query.assets.metadata(Number(id))
    console.log({metadata: metadata.toHuman()})
    process.exit()
}

module.exports = {
    assetMetadata
}