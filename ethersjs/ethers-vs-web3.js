const { ethers } = require('ethers');
const Web3 = require('web3');
const INFURA_ID = process.env.INFURA_ID;

const contracts = require('./deployed/contract.json');
const CONTRACT_NAME = 'Incrementer';
const abi = contracts[CONTRACT_NAME].abi;
const bytecode = contracts[CONTRACT_NAME].evm.bytecode.object;
const gasLimit = 5000000;
const gasPrice = '20000000000'; // 设置gas price
let contractAddress = ''; // 合约地址

// 1、连接以太坊，获取provider
// using ethers
const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
const signer = provider.getSigner();
// using web3
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
// or
// const web3 = new Web3('http://localhost:8545');
console.log('===================== Connect to Ethereum success  =====================');

// 2、获取节点账户
async function getAccounts() {
  // using ethers
  const accounts1 = await provider.listAccounts();
  console.log('ethers fetch accounts = ', accounts1);

  // using web3
  const accounts2 = await web3.eth.getAccounts();
  console.log('web3 fetch accounts = ', accounts2);
}
// getAccounts();

//3、部署合约
function deployContract() {
  // using ethers
  async function deployByEthers() {
    const factory = new ethers.ContractFactory(abi, bytecode, signer);
    const contractInstance = await factory.deploy(0);
    const tx = await contractInstance.deployTransaction.wait();
    console.log(tx);
    contractAddress = contractInstance.address;
    console.log('Contract deployed at address:', contractInstance.address); // instance with the new contract address
  }
  deployByEthers();

  // using web3
  async function deployByWeb3() {
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(abi);
    const tx = contract.deploy({
      data: bytecode,
      arguments: [0],
    });
    // const deployReceipt = tx.send({
    //   from: accounts[0],
    //   gas: gasLimit,
    //   gasPrice,
    // });
    // deployReceipt.on('receipt', function (receipt) {
    //   console.log(`Contract deployed at address: ${receipt.contractAddress}`); // contains the new contract address
    // });
    const contractInstance = await tx.send({
      from: accounts[0],
      gas: gasLimit,
      gasPrice,
    });
    console.log('Contract deployed at address:', contractInstance.options.address); // instance with the new contract address
  }
  deployByWeb3();
}
// deployContract();

// 4、调用合约方法
function callContractMethods() {
  // using ethers + 5
  async function callByEthers() {
    const readContract = new ethers.Contract(contractAddress, abi, provider);
    let currentValue = await readContract.currentValue();
    console.log('Incrementer Contract currentValue:', currentValue.toString());
    const writeContract = new ethers.Contract(contractAddress, abi, signer);
    const tx = await writeContract.increment(ethers.BigNumber.from(5));
    await tx.wait();
    currentValue = await readContract.currentValue();
    console.log('Incrementer Contract currentValue:', currentValue.toString());
  }
  // callByEthers();

  // using web3
  async function callByWeb3() {
    const accounts = await web3.eth.getAccounts();
    const contractInstance = new web3.eth.Contract(abi, contractAddress);
    let currentValue = await contractInstance.methods.currentValue().call();
    console.log('Incrementer Contract currentValue:', currentValue);
    const tx = contractInstance.methods.descrement(5);
    await tx
      .send({
        from: accounts[0],
        gas: gasLimit,
        gasPrice,
      })
      .on('receipt', async (recepit) => {
        currentValue = await contractInstance.methods.currentValue().call();
        console.log('Incrementer Contract currentValue:', currentValue);
      });
  }
  callByWeb3();
}
console.log('===================== Call Contract Methods success  =====================');
callContractMethods();

// 5、合约事件查询
function queryContractEvents() {
  // using ethers
  async function queryByEthers() {
    const readContract = new ethers.Contract(contractAddress, abi, provider);
    let filterForm = readContract.filters.Increment();
    const logs = await readContract.queryFilter(filterForm, 0, 'latest');
    logs.forEach((item) => console.log('Increment events:', item.args));
  }
  queryByEthers();

  async function queryByWeb3() {
    const contractInstance = new web3.eth.Contract(abi, contractAddress);
    const logs = await contractInstance.getPastEvents('Descrement', {
      filter: {},
      fromBlock: 0,
    });

    logs.forEach((item) => {
      console.log('Descrement Event:', item); // same results as the optional callback above
    });
  }
  queryByWeb3();
}
// queryContractEvents();
