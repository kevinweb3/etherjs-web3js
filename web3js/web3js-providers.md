# Web3js Providers节点提供商

## 目录

- [provider提供商类型​](#provider提供商类型​)
- [provider事件监听](#provider事件监听)
- [Examples](#Examples)

---

## provider提供商类型​

### HttpProvider

#### 本地节点

```js
const { Web3 } = require('web3');
const web3 = new Web3('http://localhost:8545'); 

// or
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// change provider
web3.setProvider('ws://localhost:8546');
// or
web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));

// Using the IPC provider in node.js
const net = require('net');
const web3 = new Web3('/Users/myuser/Library/Ethereum/geth.ipc', net); // mac os path
// or
const web3 = new Web3(
    new Web3.providers.IpcProvider('/Users/myuser/Library/Ethereum/geth.ipc', net),
); // mac os path
// on windows the path is: "\\\\.\\pipe\\geth.ipc"
// on linux the path is: "/users/myuser/.ethereum/geth.ipc"

```

#### 远程节点提供商​

```js
// Using a remote node provider, like Alchemy (https://www.alchemyapi.io/supernode), is simple.
const { Web3 } = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/your-api-key'));
```

#### 注入提供商​
```js
<script src="https://cdn.jsdelivr.net/npm/web3/dist/web3.min.js"></script>
<script>
    window.addEventListener('load', function () {
        // Check if web3 is available
        if (typeof window.ethereum !== 'undefined') {
            // Use the browser injected Ethereum provider
            web3 = new Web3(window.ethereum);
            // Request access to the user's MetaMask account
            window.ethereum.enable();
            // Get the user's accounts
            web3.eth.getAccounts().then(function (accounts) {
                // Show the first account
                document.getElementById('log').innerHTML =
                    'Connected with MetaMask account: ' + accounts[0];
            });
        } else {
            // If web3 is not available, give instructions to install MetaMask
            document.getElementById('log').innerHTML =
                'Please install MetaMask to connect with the Ethereum network';
        }
    });
</script>

```

### WebSocketProvider
```js
const provider = new WebSocketProvider(
        `ws://localhost:8545`,
        {
            headers: {
                // to provide the API key if the Node requires the key to be inside the `headers` for example:
                'x-api-key': '<Api key>',
            },
        },
        {
            delay: 500,
            autoReconnect: true,
            maxAttempts: 10,
        },
    );
```

### IpcProvider 
```js
const provider = new IpcProvider(
        `path.ipc`,
        {
            writable: false,
        },
        {
            delay: 500,
            autoReconnect: true,
            maxAttempts: 10,
        },
    );
```

### 提供商类型设置

```js
web3.setProvider(myProvider);
web3.eth.setProvider(myProvider);
web3.Contract.setProvider(myProvider);
contractInstance.setProvider(myProvider);
```

---

## provider事件监听

```js
import Web3 from 'web3'

const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/your-api-key'));

web3.provider.on('message',()=>{
  // ...
})

web3.provider.on('connect',()=>{
  // ...
})

web3.provider.on('disconnect',()=>{
  // ...
})

web3.provider.on('accountsChanged',()=>{
  // ...
})

web3.provider.on('chainChanged',()=>{
  // ...
})

// it is possible to catch errors that could happen in the underlying connection Socket with the `error` event
// and it is also used to catch the error when max reconnection attempts exceeded
//  as in section: /docs/guides/web3_providers_guide/#error-message
web3.provider.on('error',()=>{
  // ...
}

// ...

// for every event above `once` could be used to register to the event only once
web3.provider.once('SUPPORTED_EVENT_NAME',()=>{
  // ...
})

// And to unregister a listener `removeListener` could be called
web3.provider.removeListener('SUPPORTED_EVENT_NAME',()=>{
  // ...
})

```

--- 

## Examples

### HTTP Provider Examples

```js
const { Web3 } = require('web3');

// Connect to the Ethereum network using the HTTP provider
const ganacheUrl = 'http://localhost:7545';
const httpProvider = new Web3.providers.HttpProvider(ganacheUrl);
const web3 = new Web3(httpProvider);

async function main() {
    try {
        // 获取当前节点网络区块number
        const currentBlockNumber = await web3.eth.getBlockNumber();
        console.log('Current block number:', currentBlockNumber);

        // 获取当前节点网络账户信息
        const accounts = await web3.eth.getAccounts();

        // 发送交易
        // Note that sending a transaction with Ganache will cause it, in its default configuration, to min a new block.
        const transactionReceipt = await web3.eth.sendTransaction({
            from: accounts[0],
            to: accounts[1],
            value: web3.utils.toWei('0.001', 'ether'),
        });
        console.log('Transaction Receipt:', transactionReceipt);

        // 获取节点更新后的区块number
        const updatedBlockNumber = await web3.eth.getBlockNumber();
        console.log('Updated block number:', updatedBlockNumber);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();
```

### WebSocket Provider Examples

```js
const { Web3 } = require('web3');

// Connect to the Ethereum network using WebSocket provider
const ganacheUrl = 'ws://localhost:8545';
const wsProvider = new Web3.providers.WebsocketProvider(ganacheUrl);
const web3 = new Web3(wsProvider);

async function main() {
    try {
        console.log(
            'Does the provider support subscriptions?:',
            wsProvider.supportsSubscriptions(),
        );

        // Subscribe to new block headers
        const subscription = await web3.eth.subscribe('newBlockHeaders');

        subscription.on('data', async blockhead => {
            console.log('New block header: ', blockhead);

            // You do not need the next line if you like to keep notified for every new block
            await subscription.unsubscribe();
            console.log('Unsubscribed from new block headers.');
        });
        subscription.on('error', error =>
            console.log('Error when subscribing to New block header: ', error),
        );

        // Get the list of accounts in the connected node which is in this case: Ganache.
        const accounts = await web3.eth.getAccounts();
        // Send a transaction to the network
        const transactionReceipt = await web3.eth.sendTransaction({
            from: accounts[0],
            to: accounts[1],
            value: web3.utils.toWei('0.001', 'ether'),
        });
        console.log('Transaction Receipt:', transactionReceipt);
    } catch (error) {
        console.error(error);
    }
}

main();
```

### HTTP Provider Examples

```js
const { Web3 } = require('web3');
const { IpcProvider } = require('web3-providers-ipc');

// Connect to the Ethereum network using IPC provider
const ipcPath = '<path>'; // Replace with your actual IPC path
const ipcProvider = new IpcProvider(ipcPath);

const web3 = new Web3(ipcProvider);

async function main() {
    try {
        console.log(
            'Do the provider supports subscription?:',
            ipcProvider.supportsSubscriptions(),
        );

        // Get the list of accounts in the connected node which is in this case: geth in dev mode.
        const accounts = await web3.eth.getAccounts();
        console.log('Accounts:', accounts);

        // Send a transaction to the network
        const transactionReceipt = await web3.eth.sendTransaction({
            from: accounts[0],
            to: accounts[0], // sending a self-transaction
            value: web3.utils.toWei('0.001', 'ether'),
        });
        console.log('Transaction Receipt:', transactionReceipt);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();

```

### 浏览器注入以太坊提供商​ Examples

```js
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Connecting to the Ethereum network with Web3.js and MetaMask</title>
    </head>
    <body>
        <h1>Connecting to the Ethereum network with Web3.js and MetaMask</h1>
        <pre id="log">
  You need to approve connecting this website to MetaMask.
  Click on the MetaMask icon in the browser extension, if it did not show a popup already.
  </pre
        >

        <script src="https://cdn.jsdelivr.net/npm/web3/dist/web3.min.js"></script>
        <script>
            window.addEventListener('load', async function () {
                // Check if web3 is available
                if (typeof window.ethereum !== 'undefined') {
                    // Use the browser injected Ethereum provider
                    web3 = new Web3(window.ethereum);
                    // Request access to the user's MetaMask account (ethereum.enable() is deprecated)
                    // Note: Even though, you can also get the accounts from `await web3.eth.getAccounts()`,
                    //  you still need to make a call to any MetaMask RPC to cause MetaMask to ask for concent.
                    const accounts = await window.ethereum.request({
                        method: 'eth_requestAccounts',
                    });
                    console.log('Accounts requested from MetaMask RPC: ', accounts);

                    document.getElementById('log').textContent =
                        'Sending a self transaction... Follow the instructions on MetaMask.';

                    try {
                        // Send a transaction to the network and wait for the transaction to be mined.
                        const transactionReceipt = await web3.eth.sendTransaction({
                            from: accounts[0],
                            to: accounts[0], // sending a self-transaction
                            value: web3.utils.toWei('0.001', 'ether'),
                        });

                        document.getElementById('log').textContent =
                            'Sending a self transaction succeeded';
                        document.getElementById(
                            'log',
                        ).textContent += `\n  Transaction hash: ${transactionReceipt.transactionHash}`;
                        document.getElementById(
                            'log',
                        ).textContent += `\n  Gas Used: ${transactionReceipt.gasUsed} gwei`;
                    } catch (error) {
                        console.log('error', error);
                        document.getElementById('log').textContent =
                            'Error happened: ' + JSON.stringify(error, null, '  ');
                    }
                } else {
                    // If web3 is not available, give instructions to install MetaMask
                    document.getElementById('log').innerHTML =
                        'Please install MetaMask to connect to the Ethereum network.';
                }
            });
        </script>
    </body>
</html>
```