# Asset CLI tool 

* This tool is meant to help in interacting with the Asset Pallet (still incomplete)


## Run

* ``` yarn ```
* ``` yarn start ```
* Then follow prompts on screen

## Multsig support 

* There are 3 steps to making and executing a multisig call 
	* First  - create a multsig account
		* this only needs to be done if the account is a new account
		* note - this account is not stored on chain
	* Second - Create a multisig tx 
		* All calls have been abstracted to a Calls class [calls](/blockchainServices/palletCalls/helpers/blockchainCalls.js). When you are promted for the call, just write the function name in the class and you should be routed to the proper call (ex. mint)
		* The argument parameters need to be passed in, in order in string quotes "" in an array
		* This should generate the call automatically 

	* Third - Approve a multisig tx 
		* This should have similar steps to creating the tx 
		* If the threshold is greater than the approvals this will approve the call, if threshold is equal this will approve and fire tx 

* Trouble shooting 
	* Signatories out of order - Need to order the passed through signatories 

