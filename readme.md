# Decentralized Escrow Application

This is an Escrow Dapp built with [Hardhat](https://hardhat.org/).

## Tasks

### 1: Run the dApp on a Live Testnet 🌐
Developed on a local Hardhat node, tested on Chrome with MetaMask. Not deployed to Sepolia though.
 
### 2: Stylize 🎨
Left it pretty basic but adjusted the css flex styles to fill the screen.

### 3: Wei to Ether Conversion 💱
Used `ethers.utils.parseEther()` and `ethers.utils.formatUnits(value, "ether")` in the front end.

### 4: Persistence 💾
Refactored the front end to use local storage to persist the deployed escrow contract addresses rather than full contract objects.
Edited the smart contract to store the value, so this can be retrieved later (after the contracts balance has been 
transferred to the beneficiary)

### 5: What else? 🤔
Added a button to remove contracts from the 'existing contracts' list.
Added additional details to the display of the 'existing contracts', i.e. contract and sender addresses.
Added error messages to the smart contract, i.e. not authorised.




## Project Layout

There are three top-level folders:

1. `/app` - contains the front-end application
2. `/contracts` - contains the solidity contract
3. `/tests` - contains tests for the solidity contract

## Setup

Install dependencies in the top-level directory with `npm install`.

After you have installed hardhat locally, you can use commands to test and compile the contracts, among other things. To learn more about these commands run `npx hardhat help`.

Compile the contracts using `npx hardhat compile`. The artifacts will be placed in the `/app` folder, which will make it available to the front-end. This path configuration can be found in the `hardhat.config.js` file.

## Front-End

`cd` into the `/app` directory and run `npm install`

To run the front-end application run `npm start` from the `/app` directory. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

