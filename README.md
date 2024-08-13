# Asset CLI tool 

* This tool is meant to help in interacting with the Asset Pallet (🚧**under active development**🚧)


## Run
* ``` 
	$ yarn
	$ yarn start 
  ```
* Then follow prompts on screen.


## Running a dev environment

* To test the ledger integration you can use an `asset-hub-polkadot-dev`, `asset-hub-kusama-dev` or `asset-hub-westend-dev` chain which requires setting up the relay chain and attaching the corresponding Asset Hub as a parachain. For this purpose, 
zombienet is the preferred choice.

* To run in a dev environment:
	* [Clone](https://github.com/paritytech/polkadot-sdk/) and build Polkadot's three binaries: `polkadot`, `polkadot-execute-worker` and `polkado-prepare-worker`,  with `--features=fast-runtime`, in order to decrease the epoch time for development, and copy it into the [zombienet folder](/zombienet).
  	* Download the latest binary for [`polkadot-parachain`](https://github.com/paritytech/polkadot-sdk/releases) into the [zombienet folder](/zombienet).
	* Setup `zombienet` by downloading your OS's executable from the [latest release](https://github.com/paritytech/zombienet/releases) into the [`zombienet`](/zombienet) directory. Note: For macos users if permission is denied to run the binary you can `chmod 755 <file_name>` to allow permissions. 
	* Edit the [`config.toml`](/zombienet/config.toml) file according to your needs.

	* If you are on linux:
	* * ``` 
		$ yarn
		$ yarn dev-linux
		```
	* If you are running on macOS:
	* * ``` 
		$ yarn
		$ yarn dev-macos
		```
	* Then on a different terminal:
	* ```
		$ yarn start
		```
	* Select `local` from the list:
	* ![network-options](/docs/network-options.png)
	* After setup you must send funds from your relay chain to Polkadot Asset Hub. You can do that in polkadot.js.org/apps .
	* Set chain to Local Node under the Development option from the dropdown list.
	* On the Developer tab go to RPC calls, choose xcm pallet > teleportAssets. 
	* ![teleport](/docs/teleport.png)

	#### **Note: Ledger does not support Westend Asset Hub.**


## Multsig support 

* There are 3 steps to making and executing a multisig call 
	* First  - create a multsig account
		* this only needs to be done if the account is a new account
		* note - this account is not stored on chain
	* Second - Create a multisig tx 
		* All calls have been abstracted to a [Calls](/blockchainServices/palletCalls/helpers/blockchainCalls.js) class. When you are promted for the call, just write the function name in the class and you should be routed to the proper call (ex. mint)
		* The argument parameters need to be passed in order and in string quotes "" in an array
		* This should generate the call automatically 

	* Third - Approve a multisig tx 
		* This should have similar steps to creating the tx 
		* If the threshold is greater than the approvals this will approve the call, if threshold is equal this will approve and fire tx 

* Troubleshooting 
	* Signatories out of order - Need to order the passed through signatories 


## Ledger Support

* [Ledger has released an app](https://forum.polkadot.network/t/new-polkadot-ledger-app/8817) to be used for every chain of the Polkadot Ecosystem. This removes the need to have a specific application for every chain, but it cannot be used for accounts generated through the old apps, therefore if you still have funds on the old accounts, you need to [migrate them](https://docs.novawallet.io/nova-wallet-wiki/wallet-management/hardware-wallets/ledger-nano-x/ledger-app-migration) to the new accounts.

### Ledger Generic App Support 

* To interact with the ledger first you need to install the Ledger Polkadot Generic App from Ledger Live.

* To use the Ledger just type ledger instead of inputting a mnemonic.


### Ledger Migration App Support 

* In order to move funds from your old account to the new one as to use the new Polkadot Generic App, you need to install the Ledger Migration App from Ledger Live.

* Then to use the Ledger Migration App, you need to type migration instead of inputting a mnemonic.


## Running from a fresh machine 

* Follow the [installation guide](https://docs.substrate.io/install/) appropiate for your machine to setup rust and cargo.
* Install `nvm`: 
	``` 
	$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash 
	```  
* Install `node` via `nvm`:
	```
	$ nvm install node 
	``` 
* install `yarn` via `npm`: 
	```
	$ npm install --global yarn 
	```  
* Follow the steps for running a dev environment.
