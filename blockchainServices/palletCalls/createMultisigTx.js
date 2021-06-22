  const inquirer = require("inquirer");
  const { getKeypair, getApi, signAndSend } = require("../setup");

  const question = [
	{
	  type: "input",
	  name: "multisigAccount",
	  message: "input multisig account",
	  default: '5DjYJStmdZ2rcqXbXGX7TW85JsrW6uG4y9MUcLq2BoPMpRA7',
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
		message: 'sender of the transaction',
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
	const sender = getKeypair(admin);
	const preppedTx = await calls[`${call}`](api, arguments)
	const txToSend =  api.createType('Call', preppedTx);
	// const txToSend = api.registry.findMetaCall(callData.callIndex);

	const paymentInfo = await preppedTx.paymentInfo(sender)
	console.log(threshold, JSON.parse(otherSignatories), txToSend, false, paymentInfo.weight)
	const tx = api.tx.multisig.asMulti(threshold, JSON.parse(otherSignatories), null, txToSend.toHex(), true, 0)
	await signAndSend(tx, api, sender)
  };
  
  module.exports = {
	createMultisigTx,
  };
  