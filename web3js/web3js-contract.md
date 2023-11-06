# Web3js 智能合约交易闭环流程

## 目录

- [设置环境](#设置环境)
- [创建Node项目并初始化](#创建Node项目并初始化)
- [编写智能合约](#编写智能合约)
- [编译智能合约](#编译智能合约) 
- [Web3js库连接节点网络](#Web3js库连接节点网络) 
- [Web3js部署智能合约](#Web3js部署智能合约) 
- [Web3js在JavaScript中与智能合约交互](#Web3js在JavaScript中与智能合约交互) 
- [Web3js在TypeScript中与智能合约交互](#Web3js在TypeScript中与智能合约交互) 

---

## 设置环境

安装Ganache、Node.js、npm

---

## 创建Node项目并初始化

```js
mkdir smart-contract-tutorial
cd smart-contract-tutorial
npm init -y
npm install typescript
npm install --save @types/node
npm install web3@4.0.1-rc.1
```

---

## 编写智能合约

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
    uint256 public myNumber;

    constructor(uint256 _myNumber) {
        myNumber = _myNumber;
    }

    function setMyNumber(uint256 _myNumber) public {
        myNumber = _myNumber;
    }
}

```

---

## 编译智能合约

安装并使用solc编译合约，生成abicide和bytecode

**compile.js**

```js
// This code will compile smart contract and generate its ABI and bytecode
// Alternatively, you can use something like `npm i solc && npx solcjs MyContract.sol --bin --abi`

import solc from 'solc';
import path from 'path';
import fs from 'fs';

const fileName = 'MyContract.sol';
const contractName = 'MyContract';

// Read the Solidity source code from the file system
const contractPath = path.join(__dirname, fileName);
const sourceCode = fs.readFileSync(contractPath, 'utf8');

// solc compiler config
const input = {
    language: 'Solidity',
    sources: {
        [fileName]: {
            content: sourceCode,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};

// Compile the Solidity code using solc
const compiledCode = JSON.parse(solc.compile(JSON.stringify(input)));

// Get the bytecode from the compiled contract
const bytecode = compiledCode.contracts[fileName][contractName].evm.bytecode.object;

// Write the bytecode to a new file
const bytecodePath = path.join(__dirname, 'MyContractBytecode.bin');
fs.writeFileSync(bytecodePath, bytecode);

// Log the compiled contract code to the console
console.log('Contract Bytecode:\n', bytecode);

// Get the ABI from the compiled contract
const abi = compiledCode.contracts[fileName][contractName].abi;

// Write the Contract ABI to a new file
const abiPath = path.join(__dirname, 'MyContractAbi.json');
fs.writeFileSync(abiPath, JSON.stringify(abi, null, '\t'));

// Log the Contract ABI to the console
console.log('Contract ABI:\n', abi);

```
运行以下命令编译 Solidity 代码：
```js
node compile.js
```

--- 

## Web3js库连接节点网络
**index.js**

```js
const { Web3 } = require('web3'); //  web3.js has native ESM builds and (`import Web3 from 'web3'`)

// Set up a connection to the Ganache network
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

// Log the current block number to the console
web3.eth
    .getBlockNumber()
    .then(result => {
        console.log('Current block number: ' + result);
    })
    .catch(error => {
        console.error(error);
    });

```

行以下命令来启动项目：
```js
node index.js
```

---

## Web3js部署智能合约
**deploy.js**
```js
// For simplicity we use `web3` package here. However, if you are concerned with the size,
//  you may import individual packages like 'web3-eth', 'web3-eth-contract' and 'web3-providers-http'.
const { Web3 } = require('web3'); //  web3.js has native ESM builds and (`import Web3 from 'web3'`)
const fs = require('fs');
const path = require('path');

// Set up a connection to the Ethereum network
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
web3.eth.Contract.handleRevert = true;

// Read the bytecode from the file system
const bytecodePath = path.join(__dirname, 'MyContractBytecode.bin');
const bytecode = fs.readFileSync(bytecodePath, 'utf8');

// Create a new contract object using the ABI and bytecode
const abi = require('./MyContractAbi.json');
const MyContract = new web3.eth.Contract(abi);

async function deploy() {
    const providersAccounts = await web3.eth.getAccounts();
    const defaultAccount = providersAccounts[0];
    console.log('deployer account:', defaultAccount);

    const myContract = MyContract.deploy({
        data: '0x' + bytecode,
        arguments: [1],
    });

    // optionally, estimate the gas that will be used for development and log it
    const gas = await myContract.estimateGas({
        from: defaultAccount,
    });
    console.log('estimated gas:', gas);

    try {
        // Deploy the contract to the Ganache network
        const tx = await myContract.send({
            from: defaultAccount,
            gas,
            gasPrice: 10000000000,
        });
        console.log('Contract deployed at address: ' + tx.options.address);

        // Write the Contract address to a new file
        const deployedAddressPath = path.join(__dirname, 'MyContractAddress.bin');
        fs.writeFileSync(deployedAddressPath, tx.options.address);
    } catch (error) {
        console.error(error);
    }
}

deploy();
```

---

## Web3js在JavaScript中与智能合约交互
**interact.js**

```js
const { Web3 } = require('web3'); //  web3.js has native ESM builds and (`import Web3 from 'web3'`)
const fs = require('fs');
const path = require('path');

// Set up a connection to the Ethereum network
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
web3.eth.Contract.handleRevert = true;

// Read the contract address from the file system
const deployedAddressPath = path.join(__dirname, 'MyContractAddress.bin');
const deployedAddress = fs.readFileSync(deployedAddressPath, 'utf8');

// Read the bytecode from the file system
const bytecodePath = path.join(__dirname, 'MyContractBytecode.bin');
const bytecode = fs.readFileSync(bytecodePath, 'utf8');

// Create a new contract object using the ABI and bytecode
const abi = require('./MyContractAbi.json');
const MyContract = new web3.eth.Contract(abi, deployedAddress);

async function interact() {
    const providersAccounts = await web3.eth.getAccounts();
    const defaultAccount = providersAccounts[0];

    try {
        // Get the current value of my number
        const myNumber = await MyContract.methods.myNumber().call();
        console.log('my number value: ' + myNumber);

        // Increment my number
        const receipt = await MyContract.methods.setMyNumber(myNumber + 1n).send({
            from: defaultAccount,
            gas: 1000000,
            gasPrice: 10000000000,
        });
        console.log('Transaction Hash: ' + receipt.transactionHash);

        // Get the updated value of my number
        const myNumberUpdated = await MyContract.methods.myNumber().call();
        console.log('my number updated value: ' + myNumberUpdated);
    } catch (error) {
        console.error(error);
    }
}

interact();
```
运行以下命令与智能合约交互：
```js
node interact.js
```

---

## Web3js在TypeScript中与智能合约交互

**index.ts**

```ts
import { Contract, ContractAbi, Web3 } from 'web3';
import ERC20 from './artifacts/ERC20';

(async function () {
    const web3 = new Web3('https://goerli.infura.io/v3/fd1f29ab70844ef48e644489a411d4b3');

    const contract = new Contract(
        ERC20.abi as ContractAbi,
        '0x7af963cF6D228E564e2A0aA0DdBF06210B38615D',
        web3,
    );

    const holder = '0xa8F6eB216e26C1F7d924A801E46eaE0CE8ed1A0A';

    const balance = await contract.methods.balanceOf(holder).call();
    const ticker = await contract.methods.symbol().call();

    console.log(`${holder} as ${balance.toString()} ${ticker} tokens`);
})();
```