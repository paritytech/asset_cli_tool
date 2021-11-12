# Asset CLI tool 

* This tool is meant to help in interacting with the Asset Pallet (still incomplete)


## Run
* cp ```multisigConfig.json.example``` to ```multisigConfig.json``` and update accordingly
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

## Ledger Support 

* To interact with the ledger first you need to install the zondax ledger application for statemine. 

* If it is not in the chrome store yet you can find a how to guide here
	* https://github.com/Zondax/ledger-statemine

* To use the ledger just type ledger instead of inputting a mneumonic

## Running a dev enviroment

* To test the ledger integration you have to use a statemine-dev chain which requires setting up a relay chain and attaching statemine as a parachain

* polkadot launch has already been setup in this repo, to run one must first create a bin folder

* To run polkadot launch 
	* ``` 
		git clone https://github.com/paritytech/polkadot
		cd polkadot
		cargo build --release
		```
	* take the binary from /polkadot/target/release/polkadot and put it in the bin folder in the root of this repo
	* ```
		git clone https://github.com/paritytech/cumulus
		cd cumulus
		cargo build --release -p polkadot-collator
		```
	* take the binary from /cumulus/target/release/polkadot-collator and put it in the bin folder in the root of this repo
	* yarn 
	* yarn dev
	* your parachain should be running on ws://127.0.0.1:9988
	* to view logs tail -f 9988.log
	* after setup you must send funds from your relay chain to statemine you can do that in polkadot.js.org/apps
	* set chain to relay chain localhost:9944
	* under developer tab go to extrinsic chose xcm pallet teleport assets 
	* ![teleport](/docs/teleport.png)
	* create Asset extrinsic does can not be called with ledger so it maybe prudent to send some funds to alice too and create the asset with her account

## Running from a fresh machine 
* install cargo ( curl https://sh.rustup.rs -sSf | sh ) 
* install nvm (curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash )  
* install node via nvm ( nvm install node ) 
* install yarn via npm ( npm install --global yarn ) 
* sudo apt install build-essential, clang, pkg-config, libudev-dev 
 
* in polkadot folder run scripts/init.sh
