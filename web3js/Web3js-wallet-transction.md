# Web3js 连接钱包签名交易

## 目录

- [本地钱包交易](#本地钱包签名)
- [节点钱包交易](#节点钱包交易)
- [交易事件信息](#交易事件信息)
- [Web3js与以太坊交互](#Web3js与以太坊交互)

---

## 本地钱包交易

### 以太坊交易

```js
// First step: initialize `web3` instance
import Web3 from 'web3';
const web3 = new Web3(/* PROVIDER*/);

// Second step: add an account to wallet
const privateKeyString = '0x1f953dc9b6437fb94fcafa5dabe3faa0c34315b954dd66f41bf53273339c6d26';
const account = web3.eth.accounts.wallet.add(privateKeyString).get(0);

// Make sure the account has enough eth on balance to send the transaction

// Third step: sign and send the transaction
// Magic happens behind sendTransaction. If a transaction is sent from an account that exists in a wallet, it will be automatically signed.
try {
    const receipt = await web3.eth.sendTransaction({
        from: account?.address,
        to: '0xe4beef667408b99053dc147ed19592ada0d77f59',
        value: '0x1',
        gas: '300000',
        // other transaction's params
    });
} catch (error) {
    // catch transaction error
    console.error(error);
}
```

### 合约交易

```js
// First step: initialize `web3` instance
import Web3 from 'web3';
const web3 = new Web3(/* PROVIDER*/);

// Second step: add an account to wallet
const privateKeyString = '0x1f953dc9b6437fb94fcafa5dabe3faa0c34315b954dd66f41bf53273339c6d26';
const account = web3.eth.accounts.wallet.add(privateKeyString).get(0);

// Make sure the account has enough eth on balance to send the transaction

// Third step: sign and send the transaction
// In any function where you can pass from the address set address of the account that exists in a wallet, it will be automatically signed.

try {
    // deploy
    const contract = new web3.eth.Contract(ContractAbi);
    const contractDeployed = await contract
        .deploy({
            input: ContractBytecode,
            arguments: ['Constructor param1', 'Constructor param2'],
        })
        .send({
            from: account?.address,
            gas: '1000000',
            // other transaction's params
        });

    // call method
    await contractDeployed.methods
        .transfer('0xe2597eb05cf9a87eb1309e86750c903ec38e527e', '0x1')
        .send({
            from: account?.address,
            gas: '1000000',
            // other transaction's params
        });
} catch (error) {
    // catch transaction error
    console.error(error);
}
```

---

## 节点钱包交易

### 普通账户交易

```js
// First step: initialize web3 instance
import Web3 from 'web3';
const web3 = new Web3(/* PROVIDER*/);

// Second step: add an account to the Ethereum node and unlock it
const account = {
    privateKey: '0xb45b02f408a0dd0996aab2b55a54f4ed7735f82b133c0786a9ff372ffaaf11bd',
    address: '0xe4beef667408b99053dc147ed19592ada0d77f59',
};

// if you use ganache backend, use a private key with 0x
await web3.eth.personal.importRawKey(account.privateKey);
// if you use geth backend, use a private key without 0x
await web3.eth.personal.importRawKey(account.privateKey.slice(2));

// unlock account
await web3Personal.unlockAccount(account.address, 'anyPassword', 100000000);
// Make sure the account has enough eth on balance to send the transaction

// Third step: sign and send the transaction
try {
    const receipt = await web3.eth.sendTransaction({
        from: account.address,
        to: '0xe4beef667408b99053dc147ed19592ada0d77f59',
        value: '0x1',
        gas: '300000',
        // other transaction's params
    });
} catch (error) {
    // catch transaction error
    console.error(error);
}
```

### 合约交易

```js
// First step: initialize web3 instance
import Web3 from 'web3';
const web3 = new Web3(/* PROVIDER*/);

// Second step: add an account to the Ethereum node and unlock it
const account = {
    privateKey: '0xb45b02f408a0dd0996aab2b55a54f4ed7735f82b133c0786a9ff372ffaaf11bd',
    address: '0xe4beef667408b99053dc147ed19592ada0d77f59',
};

// if you use ganache backend, use a private key with 0x
await web3.eth.personal.importRawKey(account.privateKey);
// if you use geth backend, use a private key without 0x
await web3.eth.personal.importRawKey(account.privateKey.slice(2));

// unlock account
await web3.eth.personal.unlockAccount(account.address, 'anyPassword', 100000000);
// Make sure the account has enough eth on balance to send the transaction

// Third step: sign and send the transaction
try {
    // deploy
    const contract = new web3.eth.Contract(ContractAbi);
    const contractDeployed = await contract
        .deploy({
            input: ContractBytecode,
            arguments: ['Constructor param1', 'Constructor param2'],
        })
        .send({
            from: account.address,
            gas: '1000000',
            // other transaction's params
        });

    // call method
    await contractDeployed.methods
        .transfer('0xe2597eb05cf9a87eb1309e86750c903ec38e527e', '0x1')
        .send({
            from: account.address,
            gas: '1000000',
            // other transaction's params
        });
} catch (error) {
    // catch transaction error
    console.error(error);
}
```

---

## 交易事件信息

```js
web3.eth.sendTransaction({...})
    .on('sending', (sending) => {
        // Sending example
        // 0x02f86d82053903849502f900849a9a0d16830186a0947ab80aeb6bb488b7f6c41c58e83ef248eb39c8828080c080a0b0fce643a6ca3077ee6b83590b1798d00edef99e2c65c1837daab88d46860887a07ca449a31b2430dbf21310b8c4491386762ade23e48c7cd0b70d315576374c7c
    })
    .on('sent', (sent) => {
        // Sent example
        // 0x02f86d82053903849502f900849a9a0d16830186a0947ab80aeb6bb488b7f6c41c58e83ef248eb39c8828080c080a0b0fce643a6ca3077ee6b83590b1798d00edef99e2c65c1837daab88d46860887a07ca449a31b2430dbf21310b8c4491386762ade23e48c7cd0b70d315576374c7c
    })
    .on('transactionHash', (transactionHash) => {
        // Transaction hash example
        // 0x6d85b2f07e7c8f2a7ce90a5bcfa3100c528f173f0707164434fb42d397d92d50
    })
    .on('confirmation', (confirmation) => {
        // Confirmation example
        // {
        //     confirmations: 1n,
        //         receipt: {
        //          blockHash: '0x947b8c95dea7f0c643f2be0e9d1c3bec76c7f5146fdf34f5f1efe6d2cab5f568',
        //               blockNumber: 22n,
        //               cumulativeGasUsed: 21000n,
        //               effectiveGasPrice: 2553565308n,
        //               from: '0xe2597eb05cf9a87eb1309e86750c903ec38e527e',
        //               gasUsed: 21000n,
        //               logs: [],
        //               logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        //               status: 1n,
        //               to: '0x7ab80aeb6bb488b7f6c41c58e83ef248eb39c882',
        //               transactionHash: '0x3ec198ae10cf289b91210b4fd86a3b22cc9bcef16bca6beee21c35b76a2b7073',
        //               transactionIndex: 0n,
        //               type: 2n
        //          },
        //     latestBlockHash: '0x947b8c95dea7f0c643f2be0e9d1c3bec76c7f5146fdf34f5f1efe6d2cab5f568'
        // }

    })
    .on('receipt', (receipt) => {
        // Receipt example
        // {
        //     blockHash: '0x135d14b724d90b97feec1e96df590ce9af762d424aea49d29e11feaa24fe02f1',
        //     blockNumber: 23n,
        //     cumulativeGasUsed: 21000n,
        //     effectiveGasPrice: 2546893579n,
        //     from: '0xe2597eb05cf9a87eb1309e86750c903ec38e527e',
        //     gasUsed: 21000n,
        //     logs: [],
        //     logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        //     status: 1n,
        //     to: '0x7ab80aeb6bb488b7f6c41c58e83ef248eb39c882',
        //     transactionHash: '0x9a6497fe4028d716e66a24ab7dfd3d1bcf136ba2ec26f427719b4ddaaff76fb7',
        //     transactionIndex: 0n,
        //     type: 2n
        // }

    })
    .on('error', (error) => {
        // Error example
        // InvalidResponseError: Returned error: exceeds block gas limit
        // at Web3RequestManager._processJsonRpcResponse (.../web3_request_manager.js:193:23)
        // at Web3RequestManager.<anonymous> (.../web3_request_manager.js:112:29)
        // at Generator.next (<anonymous>)
        // at fulfilled (.../web3_request_manager.js:5:58)
        // at processTicksAndRejections (node:internal/process/task_queues:96:5) {
        //             innerError: { code: -32000, message: 'exceeds block gas limit' },
        //             code: 101,
        //             data: undefined,
        //             request: {
        //             jsonrpc: '2.0',
        //             id: 'ea1f8fb4-fe86-4492-9d89-c6e31bf1c036',
        //             method: 'eth_sendRawTransaction',
        //             params: [
        //             '0x02f86e82053903849502f900849a9a0d168405f7c1f0947ab80aeb6bb488b7f6c41c58e83ef248eb39c8828080c001a0ddd93f5ce9a6a0de130dc660e65d2cdf8784148b8c91b83635b8458e96a767a3a028c48b048bf041e530ded63a0d2198855043f782ef0aa47391a2afa9c50a5ff1'
        //             ]
        // }
    });

```

---

## Web3js与以太坊交互

### 设置环境

安装Ganache、Node.js、npm

### 创建项目架构初始化node项目

```js
mkdir web3-eth-tutorial
cd web3-eth-tutorial
npm init -y
npm install typescript
npm install --save @types/node
npm install web3@4.0.1-rc.1
```

### 设置 web3.js 并连接到节点网路

```js
const { Web3 } = require('web3'); 
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

web3.eth
    .getBlockNumber()
    .then(result => {
        console.log('Current block number: ' + result);
    })
    .catch(error => {
        console.error(error);
    });
```

### 使用 web3.js 与以太坊区块链交互

```js
const { Web3 } = require('web3'); //  web3.js has native ESM builds and (`import Web3 from 'web3'`)
const fs = require('fs');
const path = require('path');

// Set up a connection to the Ethereum network
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
web3.eth.Contract.handleRevert = true;

async function interact() {
    //fetch all the available accounts
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);

    let balance1, balance2;
    //The initial balances of the accounts should be 100 Eth (10^18 wei)
    balance1 = await web3.eth.getBalance(accounts[0]);
    balance2 = await web3.eth.getBalance(accounts[1]);

    console.log(balance1, balance2);

    //create a transaction sending 1 Ether from account 0 to account 1
    const transaction = {
        from: accounts[0],
        to: accounts[1],
        value: web3.utils.toWei('1', 'ether'), // value should be passed in wei. For easier use and to avoid mistakes we utilize the auxiliary `toWei` function.
    };

    //send the actual transaction
    const transactionHash = await web3.eth.sendTransaction(transaction);
    console.log('transactionHash', transactionHash);

    balance1 = await web3.eth.getBalance(accounts[0]);
    balance2 = await web3.eth.getBalance(accounts[1]);

    // see the updated balances
    console.log(balance1, balance2);

    // irrelevant with the actual transaction, just to know the gasPrice
    const gasPrice = await web3.eth.getGasPrice();
    console.log(gasPrice);
}

(async () => {
    await interact();
})();

``` 

### 示例代码

#### 查看合约部署预期gas

```js
import Web3, { ETH_DATA_FORMAT, DEFAULT_RETURN_FORMAT } from 'web3';

async function estimate() {
    // abi of our contract
    const abi = [
        {
            inputs: [{ internalType: 'uint256', name: '_myNumber', type: 'uint256' }],
            stateMutability: 'nonpayable',
            type: 'constructor',
        },
        {
            inputs: [],
            name: 'myNumber',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [{ internalType: 'uint256', name: '_myNumber', type: 'uint256' }],
            name: 'setMyNumber',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
    ];

    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

    //get the available accounts
    const accounts = await web3.eth.getAccounts();
    let acc = await accounts[0];

    let contract = new web3.eth.Contract(abi, undefined);

    const deployment = contract.deploy({
        data: '0x608060405234801561001057600080fd5b506040516101d93803806101d983398181016040528101906100329190610054565b806000819055505061009e565b60008151905061004e81610087565b92915050565b60006020828403121561006657600080fd5b60006100748482850161003f565b91505092915050565b6000819050919050565b6100908161007d565b811461009b57600080fd5b50565b61012c806100ad6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c806323fd0e401460375780636ffd773c146051575b600080fd5b603d6069565b6040516048919060bf565b60405180910390f35b6067600480360381019060639190608c565b606f565b005b60005481565b8060008190555050565b60008135905060868160e2565b92915050565b600060208284031215609d57600080fd5b600060a9848285016079565b91505092915050565b60b98160d8565b82525050565b600060208201905060d2600083018460b2565b92915050565b6000819050919050565b60e98160d8565b811460f357600080fd5b5056fea2646970667358221220d28cf161457f7936995800eb9896635a02a559a0561bff6a09a40bfb81cd056564736f6c63430008000033',
        // @ts-expect-error
        arguments: [1],
    });
    estimatedGas = await deployment.estimateGas(
        {
            from: acc,
        },
        DEFAULT_RETURN_FORMAT, // the returned data will be formatted as a bigint
    );

    console.log(estimatedGas);

    let estimatedGas = await deployment.estimateGas(
        {
            from: acc,
        },
        ETH_DATA_FORMAT, // the returned data will be formatted as a hexstring
    );

    console.log(estimatedGas);
}

(async () => {
    await estimate();
})();
```

### 签署一个交易发送签名

```js
import Web3 from 'web3';
const web3 = new Web3('http://localhost:7545');

//make sure to copy the private key from ganache
const privateKey = '0x0fed6f64e01bc9fac9587b6e7245fd9d056c3c004ad546a17d3d029977f0930a';
const value = web3.utils.toWei('1', 'ether');

async function sendSigned() {
    const accounts = await web3.eth.getAccounts();
    const fromAddress = accounts[0];
    const toAddress = accounts[1];
    // Create a new transaction object
    const tx = {
        from: fromAddress,
        to: toAddress,
        value: value,
        gas: 21000,
        gasPrice: web3.utils.toWei('10', 'gwei'),
        nonce: await web3.eth.getTransactionCount(fromAddress),
    };

    // Sign the transaction with the private key
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

    // Send the signed transaction to the network
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log('Transaction receipt:', receipt);
}
(async () => {
    await sendSigned();
})();
```