  const inquirer = require("inquirer");
  const { getKeypair, getApi, signAndSend, ledgerSignAndSend } = require("../setup");

  const question = [
	{
	  type: "input",
	  name: "multisigAccount",
	  message: "input multisig account",
	  default: 'DTZvNZsZYugGQFQfA6tytW5HxDPeZ5ZsdcFAesauutHniUW',
	},
	{
	  type: "input",
	  name: "call",
	  message: "the function to call",
	  default: "mint",
	},
	{
	  type: "input",
	  name: "promptArguments",
	  message: "an array of arguments",
	  default: '["1", "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", "1"]',
	},
	{
		type: 'input',
		name: 'admin',
		message: 'sender of the transaction type ledger for ledger',
		default: '//Alice'
	},
	{
		type: "input",
		name: "threshold",
		message: "m of n",
		default: "2",
	  },
	  {
		type: "input",
		name: "otherSignatories",
		message: "other signatories array",
		default: '["5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y"]',
	  },
  ];
  
  const createMultisigTx = async (calls) => {
	const { multisigAccount, call, promptArguments, threshold, otherSignatories, admin } = await inquirer.prompt(question);
	const arguments = JSON.parse(promptArguments)
	console.log({multisigAccount, call, arguments})
	const api = await getApi();
	const preppedTx = await calls[`${call}`](api, arguments)
	const txToSend =  api.createType('Call', preppedTx);

	console.log({threshold, otherSignatories: JSON.parse(otherSignatories), txToSend: txToSend.toHuman(), weight: 0})
	const tx = api.tx.multisig.asMulti(threshold, JSON.parse(otherSignatories), null, txToSend.toHex(), true, 0)
	if (admin === "ledger") {
		await ledgerSignAndSend(tx, api)
	  } else {
		const sender = getKeypair(admin);
		await signAndSend(tx, api, sender)
	  }
  };
  
  module.exports = {
	createMultisigTx,
  };
  