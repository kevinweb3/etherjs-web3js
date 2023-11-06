# Ethersjs开发功能交互集合

## 目录

- [Provider](#Provider)
- [连接MetaMask](#连接MetaMask)
- [ETH签名](#ETH签名)
- [读取合约信息](#读取合约信息)
- [发送ETH](#发送ETH)
- [合约交互](#合约交互) 
- [部署合约](#部署合约) 
- [检索事件](#检索事件) 
- [监听合约事件](#监听合约事件) 
- [事件过滤](#事件过滤) 
- [BigInt和单位转换](#BigInt和单位转换) 
- [StaticCall](#StaticCall)
- [识别ERC721合约](#识别ERC721合约)
- [编码calldata](#编码calldata)
- [批量生成钱包](#批量生成钱包)
- [批量转账](#批量转账)
- [批量归集](#批量归集)
- [MerkleTree脚本](#MerkleTree脚本)
- [数字签名脚本](#数字签名脚本)
- [监听Mempool](#监听Mempool)
- [解码交易详情](#解码交易详情)
- [靓号生成器](#靓号生成器)
- [读取任意数据](#读取任意数据)
- [抢先交易脚本](#抢先交易脚本)
- [识别ERC20合约](#识别ERC20合约)
- [Falshbots](#Falshbots)
- [EIP712签名脚本](#EIP712签名脚本)

---

### 注意：以下Ethers版本都是V6版本，不适用于V5版本，V6和V5版本部分API稍有变化

## Provider
```js
// 导入ethers包
import { ethers } from "ethers";

const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';

const provider_metaMask = new ethers.BrowserProvider(window.ethereum);
const provider_localhost = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
const provider_infura = new ethers.InfuraProvider(
    'goerli',
    INFURA_API_KEY
);
// 连接以太坊主网
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL)
// 连接Goerli测试网
const providerGoerli = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL)

const pravite_key = "0x3944e5654a267546BA6949Fa733e6AeB11788E07";

const main = async () => {
    // 利用provider读取链上信息
    // 1. 查询vitalik在主网和Goerli测试网的ETH余额
    console.log("1. 查询vitalik在主网和Goerli测试网的ETH余额");
    const balance = await provider.getBalance(`vitalik.eth`);
    const balanceGoerli = await providerGoerli.getBalance(`vitalik.eth`);
    // 将余额输出在console（主网）
    console.log(`ETH Balance of vitalik: ${ethers.formatEther(balance)} ETH`);
    // 输出Goerli测试网ETH余额
    console.log(`Goerli ETH Balance of vitalik: ${ethers.formatEther(balanceGoerli)} ETH`);
    
    // 2. 查询provider连接到了哪条链
    console.log("\n2. 查询provider连接到了哪条链")
    const network = await provider.getNetwork();
    console.log(network.toJSON());

    // 3. 查询区块高度
    console.log("\n3. 查询区块高度")
    const blockNumber = await provider.getBlockNumber();
    console.log(blockNumber);

    // 4. 查询 vitalik 钱包历史交易次数
    console.log("\n4. 查询 vitalik 钱包历史交易次数")
    const txCount = await provider.getTransactionCount("vitalik.eth");
    console.log(txCount);

    // 5. 查询当前建议的gas设置
    console.log("\n5. 查询当前建议的gas设置")
    const feeData = await provider.getFeeData();
    console.log(feeData);

    // 6. 查询区块信息
    console.log("\n6. 查询区块信息")
    const block = await provider.getBlock(0);
    console.log(block);

    // 7. 给定合约地址查询合约bytecode，例子用的WETH地址
    console.log("\n7. 给定合约地址查询合约bytecode，例子用的WETH地址")
    const code = await provider.getCode("0xc778417e063141139fce010982780140aa0cd5ab");
    console.log(code);

}

main()
```
---

## 连接MetaMask
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
    <h1 id="header">Connect to Metamask</h1>
    <button class="connect"> Connect</button>
    <h2>钱包地址: <span class="showAccount"></span></h2>
    <h2>ChainID: <span class="showChainID"></span></h2>
    <h2>ETH 余额: <span class="showETHBalance"></span></h2>

    <script type="module">
      import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.2.3/ethers.js";      const ethereumButton = document.querySelector('.connect');
      const showAccount = document.querySelector('.showAccount');
      const showChainID = document.querySelector('.showChainID');
      const showETHBalance = document.querySelector('.showETHBalance');

      ethereumButton.addEventListener(`click`, onClickHandler)
      
      async function onClickHandler() {
          console.log("连接钱包")
          // 获得provider
          const provider = new ethers.BrowserProvider(window.ethereum)
          // 读取钱包地址
          const accounts = await provider.send("eth_requestAccounts", []);
          const account = accounts[0]
          console.log(`钱包地址: ${account}`)
          showAccount.innerHTML = account;
          // 读取chainid
          const { chainId } = await provider.getNetwork()
          console.log(`chainid: ${chainId}`)
          showChainID.innerHTML = chainId;
          // 读取ETH余额
          const signer = await provider.getSigner()
          const balance = await provider.getBalance(signer.getAddress());
          console.log(`以太坊余额： ${ethers.formatUnits(balance)}`)
          showETHBalance.innerHTML = ethers.formatUnits(balance);
        }
    </script>  
  </body>
</html>
```
---

## ETH签名
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<h1 id="header">Sign in with Ethereum</h1>
<button class="sign">Sign</button>
<h2>钱包地址: <span class="showAccount"></span></h2>
<h2>Nonce: <span class="showNonce"></span></h2>
<h2>Signature: <span class="showSignature"></span></h2>
<h2>是否签名成功: <span class="showSignStatus"></span></h2>

<script type="module">
    import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.2.3/ethers.js";      const ethereumButton = document.querySelector('.connect');

    const signButton = document.querySelector('.sign');
    const showAccount = document.querySelector('.showAccount');
    const showNonce = document.querySelector('.showNonce');
    const showSignature = document.querySelector('.showSignature');
    const showSignStatus = document.querySelector('.showSignStatus');

    signButton.addEventListener(`click`, onClickHandler)

    // 前端签名流程
    async function onClickHandler() {
        console.log("连接钱包")
        // 获得provider
        const provider = new ethers.BrowserProvider(window.ethereum)
        // 读取钱包地址
        const accounts = await provider.send("eth_requestAccounts", []);
        const account = accounts[0]
        console.log(`钱包地址: ${account}`)
        showAccount.innerHTML = account;

        //从后台获取需要进行签名的数据
        const nonce = auth(account);
        showNonce.innerHTML = nonce;
        console.log(`获取后台需要签名的数据: ${nonce}`)
        //签名
        const signer = await provider.getSigner()
        const signature = await signer.signMessage(nonce.toString())
        showSignature.innerHTML = signature;
        //去后台验证签名，完成登录
        const signStatus = verify(account, signature);
        showSignStatus.innerHTML = signStatus;
    }

    //==============================模拟后台服务=======================================

    //假设这是后台的数据库，users表里保存了user对象，user对象包含用户的地址和关联的nonce
    //{"address": 用户地址, "nonce": 返回给前端的随机数nonce}
    export const users = {}

    /**
     * 通过地址获取后端生成的随机数 nonce，用于签名
     * @param address  用户地址
     * @returns {number} 返回随机数 nonce
     *
     * 这个方法充当后台服务，从后台中获取需要签名的数据
     */
    function auth(address) {
        let user = users[address]
        if (!user) {
            user = {
                address,
                nonce: Math.floor(Math.random() * 10000000)
            }
            users[address] = user
        } else {
            const nonce = Math.floor(Math.random() * 10000000)
            user.nonce = nonce
            users[address] = user
        }
        return user.nonce
    }

    /**
     * 验证用户签名是否正确
     * @param address   用户地址
     * @param signature 签名数据
     * @returns {boolean} 返回签名是否正确
     *
     * 这个方法充当后台服务，后台验证签名正确后，就返回相关登录态数据，完成登录流程
     */
    function verify(address, signature) {
        let signValid = false
        console.log(`address: ${address}`)
        //从数据库中取出nonce
        let nonce = users[address].nonce
        console.log(`nonce: ${nonce}`)
        //验证对nonce进行签名的地址
        const decodedAddress = ethers.verifyMessage(nonce.toString(), signature.toString())
        console.log(`decodedAddress: ${decodedAddress}`)
        //比较地址和签名的地址是否一致
        if (address.toLowerCase() === decodedAddress.toLowerCase()) {
            signValid = true
            //出于安全原因，更改nonce，防止下次直接使用相同的nonce进行登录
            users[address].nonce = Math.floor(Math.random() * 10000000)
        }
        return signValid
    }
</script>
</body>
</html>

```
---

## 读取合约信息
```js
import { ethers } from "ethers";
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// 第1种输入abi的方式: 复制abi全文
// WETH的abi可以在这里复制：https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2#code
const abiWETH = '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]';

const addressWETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' // WETH Contract
const contractWETH = new ethers.Contract(addressWETH, abiWETH, provider)

// 第2种输入abi的方式：输入程序需要用到的函数，逗号分隔，ethers会自动帮你转换成相应的abi
// 人类可读abi，以ERC20合约为例
const abiERC20 = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint)",
];
const addressDAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI Contract
const contractDAI = new ethers.Contract(addressDAI, abiERC20, provider)


const main = async () => {
    // 1. 读取WETH合约的链上信息（WETH abi）
    const nameWETH = await contractWETH.name()
    const symbolWETH = await contractWETH.symbol()
    const totalSupplyWETH = await contractWETH.totalSupply()
    console.log("\n1. 读取WETH合约信息")
    console.log(`合约地址: ${addressWETH}`)
    console.log(`名称: ${nameWETH}`)
    console.log(`代号: ${symbolWETH}`)
    console.log(`总供给: ${ethers.formatEther(totalSupplyWETH)}`)
    const balanceWETH = await contractWETH.balanceOf('vitalik.eth')
    console.log(`Vitalik持仓: ${ethers.formatEther(balanceWETH)}\n`)

    // 2. 读取DAI合约的链上信息（IERC20接口合约）
    const nameDAI = await contractDAI.name()
    const symbolDAI = await contractDAI.symbol()
    const totalSupplDAI = await contractDAI.totalSupply()
    console.log("\n2. 读取DAI合约信息")
    console.log(`合约地址: ${addressDAI}`)
    console.log(`名称: ${nameDAI}`)
    console.log(`代号: ${symbolDAI}`)
    console.log(`总供给: ${ethers.formatEther(totalSupplDAI)}`)
    const balanceDAI = await contractDAI.balanceOf('vitalik.eth')
    console.log(`Vitalik持仓: ${ethers.formatEther(balanceDAI)}\n`)
}

main()
```
---

## 发送ETH
```js
// 利用Wallet类发送ETH
// 由于playcode不支持ethers.Wallet.createRandom()函数，我们只能用VScode运行这一讲代码
import { ethers } from "ethers";

// 利用Alchemy的rpc节点连接以太坊测试网络
// 准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// 创建随机的wallet对象
const wallet1 = ethers.Wallet.createRandom()
const wallet1WithProvider = wallet1.connect(provider)
const mnemonic = wallet1.mnemonic // 获取助记词

// 利用私钥和provider创建wallet对象
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet2 = new ethers.Wallet(privateKey, provider)

// 从助记词创建wallet对象
const wallet3 = ethers.Wallet.fromPhrase(mnemonic.phrase)

const main = async () => {
    // 1. 获取钱包地址
    const address1 = await wallet1.getAddress()
    const address2 = await wallet2.getAddress() 
    const address3 = await wallet3.getAddress() // 获取地址
    console.log(`1. 获取钱包地址`);
    console.log(`钱包1地址: ${address1}`);
    console.log(`钱包2地址: ${address2}`);
    console.log(`钱包3地址: ${address3}`);
    console.log(`钱包1和钱包3的地址是否相同: ${address1 === address3}`);
    
    // 2. 获取助记词
    console.log(`\n2. 获取助记词`);
    console.log(`钱包1助记词: ${wallet1.mnemonic.phrase}`)
    // 注意：从private key生成的钱包没有助记词
    // console.log(wallet2.mnemonic.phrase)

    // 3. 获取私钥
    console.log(`\n3. 获取私钥`);
    console.log(`钱包1私钥: ${wallet1.privateKey}`)
    console.log(`钱包2私钥: ${wallet2.privateKey}`)

    // 4. 获取链上发送交易次数    
    console.log(`\n4. 获取链上交易次数`);
    const txCount1 = await provider.getTransactionCount(wallet1WithProvider)
    const txCount2 = await provider.getTransactionCount(wallet2)
    console.log(`钱包1发送交易次数: ${txCount1}`)
    console.log(`钱包2发送交易次数: ${txCount2}`)

    // 5. 发送ETH
    // 如果这个钱包没goerli测试网ETH了，去水龙头领一些，钱包地址: 0xe16C1623c1AA7D919cd2241d8b36d9E79C1Be2A2
    // 1. chainlink水龙头: https://faucets.chain.link/goerli
    // 2. paradigm水龙头: https://faucet.paradigm.xyz/
    console.log(`\n5. 发送ETH（测试网）`);
    // i. 打印交易前余额
    console.log(`i. 发送前余额`)
    console.log(`钱包1: ${ethers.formatEther(await provider.getBalance(wallet1WithProvider))} ETH`)
    console.log(`钱包2: ${ethers.formatEther(await provider.getBalance(wallet2))} ETH`)
    // ii. 构造交易请求，参数：to为接收地址，value为ETH数额
    const tx = {
        to: address1,
        value: ethers.parseEther("0.001")
    }
    // iii. 发送交易，获得收据
    console.log(`\nii. 等待交易在区块链确认（需要几分钟）`)
    const receipt = await wallet2.sendTransaction(tx)
    await receipt.wait() // 等待链上确认交易
    console.log(receipt) // 打印交易详情
    // iv. 打印交易后余额
    console.log(`\niii. 发送后余额`)
    console.log(`钱包1: ${ethers.formatEther(await provider.getBalance(wallet1WithProvider))} ETH`)
    console.log(`钱包2: ${ethers.formatEther(await provider.getBalance(wallet2))} ETH`)
}

main()

```
---

## 合约交互
```js
// 声明只可写合约的规则：
// const contract = new ethers.Contract(address, abi, signer);
// 参数分别为合约地址`address`，合约ABI `abi`，Signer变量`signer`

import { ethers } from "ethers";
// playcode免费版不能安装ethers，用这条命令，需要从网络上import包（把上面这行注释掉）
// import { ethers } from "https://cdn-cors.ethers.io/lib/ethers-5.6.9.esm.min.js";

// 利用Alchemy的rpc节点连接以太坊网络
// 准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// 利用私钥和provider创建wallet对象
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)

// WETH的ABI
const abiWETH = [
    "function balanceOf(address) public view returns(uint)",
    "function deposit() public payable",
    "function transfer(address, uint) public returns (bool)",
    "function withdraw(uint) public",
];
// WETH合约地址（Goerli测试网）
const addressWETH = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6' 
// WETH Contract

// 声明可写合约
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)
// 也可以声明一个只读合约，再用connect(wallet)函数转换成可写合约。
// const contractWETH = new ethers.Contract(addressWETH, abiWETH, provider)
// contractWETH.connect(wallet)

const main = async () => {

    const address = await wallet.getAddress()
    // 1. 读取WETH合约的链上信息（WETH abi）
    console.log("\n1. 读取WETH余额")
    const balanceWETH = await contractWETH.balanceOf(address)
    console.log(`存款前WETH持仓: ${ethers.formatEther(balanceWETH)}\n`)
    //读取钱包内ETH余额
    const balanceETH = await provider.getBalance(wallet)
    
    // 如果钱包ETH足够
    if(ethers.formatEther(balanceETH) > 0.0015){

        // 2. 调用desposit()函数，将0.001 ETH转为WETH
        console.log("\n2. 调用desposit()函数，存入0.001 ETH")
        // 发起交易
        const tx = await contractWETH.deposit({value: ethers.parseEther("0.001")})
        // 等待交易上链
        await tx.wait()
        console.log(`交易详情：`)
        console.log(tx)
        const balanceWETH_deposit = await contractWETH.balanceOf(address)
        console.log(`存款后WETH持仓: ${ethers.formatEther(balanceWETH_deposit)}\n`)

        // 3. 调用transfer()函数，将0.001 WETH转账给 vitalik
        console.log("\n3. 调用transfer()函数，给vitalik转账0.001 WETH")
        // 发起交易
        const tx2 = await contractWETH.transfer("vitalik.eth", ethers.parseEther("0.001"))
        // 等待交易上链
        await tx2.wait()
        const balanceWETH_transfer = await contractWETH.balanceOf(address)
        console.log(`转账后WETH持仓: ${ethers.formatEther(balanceWETH_transfer)}\n`)

    }else{
        // 如果ETH不足
        console.log("ETH不足，去水龙头领一些Goerli ETH")
        console.log("1. chainlink水龙头: https://faucets.chain.link/goerli")
        console.log("2. paradigm水龙头: https://faucet.paradigm.xyz/")
    }
}

main()

```
---

## 部署合约
```js
// 创建合约工厂实例的规则：
// const contractFactory = new ethers.ContractFactory(abi, bytecode, signer);
// 参数分别为合约ABI`abi`，合约字节码`bytecode`，Signer变量`signer`

// 利用合约工厂部署合约：
// contractFactory.deploy(args)
// 其中args为合约构造函数的参数

import { ethers } from "ethers";

// 利用Alchemy的rpc节点连接以太坊网络
// 准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// 利用私钥和provider创建wallet对象
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)

// ERC20的人类可读abi
const abiERC20 = [
    "constructor(string memory name_, string memory symbol_)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint)",
    "function transfer(address to, uint256 amount) external returns (bool)",
    "function mint(uint amount) external",
];

// 填入合约字节码，在remix中，你可以在两个地方找到Bytecode
// 1. 编译面板的Bytecode按钮
// 2. 文件面板artifact文件夹下与合约同名的json文件中
// 里面"bytecode"属性下的"object"字段对应的数据就是Bytecode，挺长的，608060起始
// "object": "608060405260646000553480156100...
const bytecodeERC20 = "60806040526012600560006101000a81548160ff021916908360ff1602179055503480156200002d57600080fd5b5060405162001166380380620011668339818101604052810190620000539190620001bb565b81600390805190602001906200006b9291906200008d565b508060049080519060200190620000849291906200008d565b505050620003c4565b8280546200009b90620002d5565b90600052602060002090601f016020900481019282620000bf57600085556200010b565b82601f10620000da57805160ff19168380011785556200010b565b828001600101855582156200010b579182015b828111156200010a578251825591602001919060010190620000ed565b5b5090506200011a91906200011e565b5090565b5b80821115620001395760008160009055506001016200011f565b5090565b6000620001546200014e8462000269565b62000240565b905082815260208101848484011115620001735762000172620003a4565b5b620001808482856200029f565b509392505050565b600082601f830112620001a0576200019f6200039f565b5b8151620001b28482602086016200013d565b91505092915050565b60008060408385031215620001d557620001d4620003ae565b5b600083015167ffffffffffffffff811115620001f657620001f5620003a9565b5b620002048582860162000188565b925050602083015167ffffffffffffffff811115620002285762000227620003a9565b5b620002368582860162000188565b9150509250929050565b60006200024c6200025f565b90506200025a82826200030b565b919050565b6000604051905090565b600067ffffffffffffffff82111562000287576200028662000370565b5b6200029282620003b3565b9050602081019050919050565b60005b83811015620002bf578082015181840152602081019050620002a2565b83811115620002cf576000848401525b50505050565b60006002820490506001821680620002ee57607f821691505b6020821081141562000305576200030462000341565b5b50919050565b6200031682620003b3565b810181811067ffffffffffffffff8211171562000338576200033762000370565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b610d9280620003d46000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c806342966c681161007157806342966c681461016857806370a082311461018457806395d89b41146101b4578063a0712d68146101d2578063a9059cbb146101ee578063dd62ed3e1461021e576100a9565b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100fc57806323b872dd1461011a578063313ce5671461014a575b600080fd5b6100b661024e565b6040516100c39190610b02565b60405180910390f35b6100e660048036038101906100e19190610a14565b6102dc565b6040516100f39190610ae7565b60405180910390f35b6101046103ce565b6040516101119190610b24565b60405180910390f35b610134600480360381019061012f91906109c1565b6103d4565b6040516101419190610ae7565b60405180910390f35b610152610583565b60405161015f9190610b3f565b60405180910390f35b610182600480360381019061017d9190610a54565b610596565b005b61019e60048036038101906101999190610954565b61066d565b6040516101ab9190610b24565b60405180910390f35b6101bc610685565b6040516101c99190610b02565b60405180910390f35b6101ec60048036038101906101e79190610a54565b610713565b005b61020860048036038101906102039190610a14565b6107ea565b6040516102159190610ae7565b60405180910390f35b61023860048036038101906102339190610981565b610905565b6040516102459190610b24565b60405180910390f35b6003805461025b90610c88565b80601f016020809104026020016040519081016040528092919081815260200182805461028790610c88565b80156102d45780601f106102a9576101008083540402835291602001916102d4565b820191906000526020600020905b8154815290600101906020018083116102b757829003601f168201915b505050505081565b600081600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040516103bc9190610b24565b60405180910390a36001905092915050565b60025481565b600081600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546104629190610bcc565b92505081905550816000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546104b79190610bcc565b92505081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461050c9190610b76565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516105709190610b24565b60405180910390a3600190509392505050565b600560009054906101000a900460ff1681565b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546105e49190610bcc565b9250508190555080600260008282546105fd9190610bcc565b92505081905550600073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516106629190610b24565b60405180910390a350565b60006020528060005260406000206000915090505481565b6004805461069290610c88565b80601f01602080910402602001604051908101604052809291908181526020018280546106be90610c88565b801561070b5780601f106106e05761010080835404028352916020019161070b565b820191906000526020600020905b8154815290600101906020018083116106ee57829003601f168201915b505050505081565b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546107619190610b76565b92505081905550806002600082825461077a9190610b76565b925050819055503373ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516107df9190610b24565b60405180910390a350565b6000816000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461083a9190610bcc565b92505081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461088f9190610b76565b925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516108f39190610b24565b60405180910390a36001905092915050565b6001602052816000526040600020602052806000526040600020600091509150505481565b60008135905061093981610d2e565b92915050565b60008135905061094e81610d45565b92915050565b60006020828403121561096a57610969610d18565b5b60006109788482850161092a565b91505092915050565b6000806040838503121561099857610997610d18565b5b60006109a68582860161092a565b92505060206109b78582860161092a565b9150509250929050565b6000806000606084860312156109da576109d9610d18565b5b60006109e88682870161092a565b93505060206109f98682870161092a565b9250506040610a0a8682870161093f565b9150509250925092565b60008060408385031215610a2b57610a2a610d18565b5b6000610a398582860161092a565b9250506020610a4a8582860161093f565b9150509250929050565b600060208284031215610a6a57610a69610d18565b5b6000610a788482850161093f565b91505092915050565b610a8a81610c12565b82525050565b6000610a9b82610b5a565b610aa58185610b65565b9350610ab5818560208601610c55565b610abe81610d1d565b840191505092915050565b610ad281610c3e565b82525050565b610ae181610c48565b82525050565b6000602082019050610afc6000830184610a81565b92915050565b60006020820190508181036000830152610b1c8184610a90565b905092915050565b6000602082019050610b396000830184610ac9565b92915050565b6000602082019050610b546000830184610ad8565b92915050565b600081519050919050565b600082825260208201905092915050565b6000610b8182610c3e565b9150610b8c83610c3e565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115610bc157610bc0610cba565b5b828201905092915050565b6000610bd782610c3e565b9150610be283610c3e565b925082821015610bf557610bf4610cba565b5b828203905092915050565b6000610c0b82610c1e565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60005b83811015610c73578082015181840152602081019050610c58565b83811115610c82576000848401525b50505050565b60006002820490506001821680610ca057607f821691505b60208210811415610cb457610cb3610ce9565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600080fd5b6000601f19601f8301169050919050565b610d3781610c00565b8114610d4257600080fd5b50565b610d4e81610c3e565b8114610d5957600080fd5b5056fea2646970667358221220f87d0662c51e3b4b5e034fe8e1e7a10185cda3c246a5ba78e0bafe683d67789764736f6c63430008070033";

const factoryERC20 = new ethers.ContractFactory(abiERC20, bytecodeERC20, wallet);

const main = async () => {
    // 读取钱包内ETH余额
    const balanceETH = await provider.getBalance(wallet)

    // 如果钱包ETH足够
    if(ethers.formatEther(balanceETH) > 0.002){
        // 1. 利用contractFactory部署ERC20代币合约
        console.log("\n1. 利用contractFactory部署ERC20代币合约")
        // 部署合约，填入constructor的参数
        const contractERC20 = await factoryERC20.deploy("WTF Token", "WTF")
        console.log(`合约地址: ${contractERC20.target}`);
        console.log("部署合约的交易详情")
        console.log(contractERC20.deploymentTransaction())
        console.log("\n等待合约部署上链")
        await contractERC20.waitForDeployment()
        // 也可以用 contractERC20.deployTransaction.wait()
        console.log("合约已上链")

        // 2. 打印合约的name()和symbol()，然后调用mint()函数，给自己地址mint 10,000代币
        console.log("\n2. 调用mint()函数，给自己地址mint 10,000代币")
        console.log(`合约名称: ${await contractERC20.name()}`)
        console.log(`合约代号: ${await contractERC20.symbol()}`)
        let tx = await contractERC20.mint("10000")
        console.log("等待交易上链")
        await tx.wait()
        console.log(`mint后地址中代币余额: ${await contractERC20.balanceOf(wallet)}`)
        console.log(`代币总供给: ${await contractERC20.totalSupply()}`)

        // 3. 调用transfer()函数，给V神转账1000代币
        console.log("\n3. 调用transfer()函数，给V神转账1,000代币")
        tx = await contractERC20.transfer("vitalik.eth", "1000")
        console.log("等待交易上链")
        await tx.wait()
        console.log(`V神钱包中的代币余额: ${await contractERC20.balanceOf("vitalik.eth")}`)

    }else{
        // 如果ETH不足
        console.log("ETH不足，去水龙头领一些Goerli ETH")
        console.log("1. chainlink水龙头: https://faucets.chain.link/goerli")
        console.log("2. paradigm水龙头: https://faucet.paradigm.xyz/")
    }
}

main()

```
---

## 检索事件
```js
// 检索事件的方法：
// const transferEvents = await contract.queryFilter("事件名", [起始区块高度，结束区块高度])
// 其中起始区块高度和结束区块高度为选填参数。

import { ethers } from "ethers";
// playcode免费版不能安装ethers，用这条命令，需要从网络上import包（把上面这行注释掉）
// import { ethers } from "https://cdn-cors.ethers.io/lib/ethers-5.6.9.esm.min.js";

// 利用Alchemy的rpc节点连接以太坊网络
// 准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// WETH ABI，只包含我们关心的Transfer事件
const abiWETH = [
    "event Transfer(address indexed from, address indexed to, uint amount)"
];

// 测试网WETH地址
const addressWETH = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6'
// 声明合约实例
const contract = new ethers.Contract(addressWETH, abiWETH, provider)

const main = async () => {

    // 获取过去10个区块内的Transfer事件
    console.log("\n1. 获取过去10个区块内的Transfer事件，并打印出1个");
    // 得到当前block
    const block = await provider.getBlockNumber()
    console.log(`当前区块高度: ${block}`);
    console.log(`打印事件详情:`);
    const transferEvents = await contract.queryFilter('Transfer', block - 10, block)
    // 打印第1个Transfer事件
    console.log(transferEvents[0])

    // 解析Transfer事件的数据（变量在args中）
    console.log("\n2. 解析事件：")
    const amount = ethers.formatUnits(ethers.getBigInt(transferEvents[0].args["amount"]), "ether");
    console.log(`地址 ${transferEvents[0].args["from"]} 转账${amount} WETH 到地址 ${transferEvents[0].args["to"]}`)
}

main()

```
---

## 监听合约事件
```js
// 监听合约方法：
// 1. 持续监听
// contractUSDT.on("事件名", Listener)
// 2. 只监听一次
// contractUSDT.once("事件名", Listener)

import { ethers } from "ethers";

// 准备 alchemy API  
// 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
// 连接主网 provider
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// USDT的合约地址
const contractAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'
// 构建USDT的Transfer的ABI
const abi = [
  "event Transfer(address indexed from, address indexed to, uint value)"
];
// 生成USDT合约对象
const contractUSDT = new ethers.Contract(contractAddress, abi, provider);


const main = async () => {
  // 监听USDT合约的Transfer事件

  try{
    // 只监听一次
    console.log("\n1. 利用contract.once()，监听一次Transfer事件");
    contractUSDT.once('Transfer', (from, to, value)=>{
      // 打印结果
      console.log(
        `${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value),6)}`
      )
    })

    // 持续监听USDT合约
    console.log("\n2. 利用contract.on()，持续监听Transfer事件");
    contractUSDT.on('Transfer', (from, to, value)=>{
      console.log(
       // 打印结果
       `${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value),6)}`
      )
    })

  }catch(e){
    console.log(e);

  } 
}
main()
```
---

## 事件过滤
```js
import { ethers } from "ethers";

// 利用Alchemy的rpc节点连接以太坊网络
// 准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// 合约地址
const addressUSDT = '0xdac17f958d2ee523a2206206994597c13d831ec7'
// 交易所地址
const accountBinance = '0x28C6c06298d514Db089934071355E5743bf21d60'
// 构建ABI
const abi = [
  "event Transfer(address indexed from, address indexed to, uint value)",
  "function balanceOf(address) public view returns(uint)",
];
// 构建合约对象
const contractUSDT = new ethers.Contract(addressUSDT, abi, provider);


(async () => {
  try {
    // 1. 读取币安热钱包USDT余额
    console.log("\n1. 读取币安热钱包USDT余额")
    const balanceUSDT = await contractUSDT.balanceOf(accountBinance)
    console.log(`USDT余额: ${ethers.formatUnits(balanceUSDT,6)}\n`)

    // 2. 创建过滤器，监听转移USDT进交易所
    console.log("\n2. 创建过滤器，监听USDT转进交易所")
    let filterBinanceIn = contractUSDT.filters.Transfer(null, accountBinance);
    console.log("过滤器详情：")
    console.log(filterBinanceIn);
    contractUSDT.on(filterBinanceIn, (res) => {
      console.log('---------监听USDT进入交易所--------');
      console.log(
        `${res.args[0]} -> ${res.args[1]} ${ethers.formatUnits(res.args[2],6)}`
      )
    })

    // 3. 创建过滤器，监听交易所转出USDT
    let filterToBinanceOut = contractUSDT.filters.Transfer(accountBinance);
    console.log("\n3. 创建过滤器，监听USDT转出交易所")
    console.log("过滤器详情：")
    console.log(filterToBinanceOut);
    contractUSDT.on(filterToBinanceOut, (res) => {
      console.log('---------监听USDT转出交易所--------');
      console.log(
        `${res.args[0]} -> ${res.args[1]} ${ethers.formatUnits(res.args[2],6)}`
      )
    }
    );
  } catch (e) {
    console.log(e);
  }
})()
```
---

## BigInt和单位转换
```js
import { ethers } from "ethers";

// 1. BigNumber
console.group('\n1. BigNumber类');

const oneGwei = ethers.getBigInt("1000000000"); // 从十进制字符串生成
console.log(oneGwei)
console.log(ethers.getBigInt("0x3b9aca00")) // 从hex字符串生成
console.log(ethers.getBigInt(1000000000)) // 从数字生成
// 不能从js最大的安全整数之外的数字生成BigNumber，下面代码会报错
// ethers.getBigInt(Number.MAX_SAFE_INTEGER);
console.log("js中最大安全整数：", Number.MAX_SAFE_INTEGER)

// 运算
console.log("加法：", oneGwei + 1n)
console.log("减法：", oneGwei - 1n)
console.log("乘法：", oneGwei * 2n)
console.log("除法：", oneGwei / 2n)
// 比较
console.log("是否相等：", oneGwei == 1000000000n)


// 2. 格式化：小单位转大单位
// 例如将wei转换为ether：formatUnits(变量, 单位)：单位填位数（数字）或指定的单位（字符串）
console.group('\n2. 格式化：小单位转大单位，formatUnits');
console.log(ethers.formatUnits(oneGwei, 0));
// '1000000000'
console.log(ethers.formatUnits(oneGwei, "gwei"));
// '1.0'
console.log(ethers.formatUnits(oneGwei, 9));
// '1.0'
console.log(ethers.formatUnits(oneGwei, "ether"));
// `0.000000001`
console.log(ethers.formatUnits(1000000000, "gwei"));
// '1.0'
console.log(ethers.formatEther(oneGwei));
// `0.000000001` 等同于formatUnits(value, "ether")
console.groupEnd();


// 3. 解析：大单位转小单位
// 例如将ether转换为wei：parseUnits(变量, 单位),parseUnits默认单位是 ether
console.group('\n3. 解析：大单位转小单位，parseUnits');
console.log(ethers.parseUnits("1.0").toString());
// { BigNumber: "1000000000000000000" }
console.log(ethers.parseUnits("1.0", "ether").toString());
// { BigNumber: "1000000000000000000" }
console.log(ethers.parseUnits("1.0", 18).toString());
// { BigNumber: "1000000000000000000" }
console.log(ethers.parseUnits("1.0", "gwei").toString());
// { BigNumber: "1000000000" }
console.log(ethers.parseUnits("1.0", 9).toString());
// { BigNumber: "1000000000" }
console.log(ethers.parseEther("1.0").toString());
// { BigNumber: "1000000000000000000" } 等同于parseUnits(value, "ether")
console.groupEnd();

```
---

## StaticCall
```js
// contract.函数名.staticCall(参数, {override})
import { ethers } from "ethers";

//准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// 利用私钥和provider创建wallet对象
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)

// DAI的ABI
const abiDAI = [
    "function balanceOf(address) public view returns(uint)",
    "function transfer(address, uint) public returns (bool)",
];
// DAI合约地址（主网）
const addressDAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI Contract

// 创建DAI合约实例
const contractDAI = new ethers.Contract(addressDAI, abiDAI, provider)

const main = async () => {
    try {
    const address = await wallet.getAddress()
    // 1. 读取DAI合约的链上信息
    console.log("\n1. 读取测试钱包的DAI余额")
    const balanceDAI = await contractDAI.balanceOf(address)
    const balanceDAIVitalik = await contractDAI.balanceOf("vitalik.eth")

    console.log(`测试钱包 DAI持仓: ${ethers.formatEther(balanceDAI)}\n`)
    console.log(`vitalik DAI持仓: ${ethers.formatEther(balanceDAIVitalik)}\n`)

    // 2. 用staticCall尝试调用transfer转账10000 DAI，msg.sender为V神，交易将成功
    console.log("\n2.  用staticCall尝试调用transfer转账1 DAI，msg.sender为V神地址")
    // 发起交易
    const tx = await contractDAI.transfer.staticCall("vitalik.eth", ethers.parseEther("10000"), {from: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"})
    console.log(`交易会成功吗？：`, tx)

    // 3. 用staticCall尝试调用transfer转账10000 DAI，msg.sender为测试钱包地址，交易将失败
    console.log("\n3.  用staticCall尝试调用transfer转账1 DAI，msg.sender为测试钱包地址")
    const tx2 = await contractDAI.transfer.staticCall("vitalik.eth", ethers.parseEther("10000"), {from: address})
    console.log(`交易会成功吗？：`, tx)

    } catch (e) {
        console.log(e);
      }
}

main()

```
---

## 识别ERC721合约
```js
import { ethers } from "ethers";

//准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// 合约abi
const abiERC721 = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function supportsInterface(bytes4) public view returns(bool)",
];
// ERC721的合约地址，这里用的BAYC
const addressBAYC = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"
// 创建ERC721合约实例
const contractERC721 = new ethers.Contract(addressBAYC, abiERC721, provider)

// ERC721接口的ERC165 identifier
const selectorERC721 = "0x80ac58cd"

const main = async () => {
    try {
    // 1. 读取ERC721合约的链上信息
    const nameERC721 = await contractERC721.name()
    const symbolERC721 = await contractERC721.symbol()
    console.log("\n1. 读取ERC721合约信息")
    console.log(`合约地址: ${addressBAYC}`)
    console.log(`名称: ${nameERC721}`)
    console.log(`代号: ${symbolERC721}`)

    // 2. 利用ERC165的supportsInterface，确定合约是否为ERC721标准
    const isERC721 = await contractERC721.supportsInterface(selectorERC721)
    console.log("\n2. 利用ERC165的supportsInterface，确定合约是否为ERC721标准")
    console.log(`合约是否为ERC721标准: ${isERC721}`)
    }catch (e) {
        // 如果不是ERC721，则会报错
        console.log(e);
    }
}

main()
```
---

## 编码calldata
```js
// Interface 接口类
// 利用abi生成
// const interface = ethers.Interface(abi)
// 直接从contract中获取
// const interface2 = contract.interface
import { ethers } from "ethers";

//准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// 利用私钥和provider创建wallet对象
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b'
const wallet = new ethers.Wallet(privateKey, provider)

// WETH的ABI
const abiWETH = [
    "function balanceOf(address) public view returns(uint)",
    "function deposit() public payable",
];
// WETH合约地址（Goerli测试网）
const addressWETH = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6'

// 声明WETH合约
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)

const main = async () => {

    const address = await wallet.getAddress()
    // 1. 读取WETH合约的链上信息（WETH abi）
    console.log("\n1. 读取WETH余额")
    // 编码calldata
    const param1 = contractWETH.interface.encodeFunctionData(
        "balanceOf",
        [address]
      );
    console.log(`编码结果： ${param1}`)
    // 创建交易
    const tx1 = {
        to: addressWETH,
        data: param1
    }
    // 发起交易，可读操作（view/pure）可以用 provider.call(tx)
    const balanceWETH = await provider.call(tx1)
    console.log(`存款前WETH持仓: ${ethers.formatEther(balanceWETH)}\n`)

    //读取钱包内ETH余额
    const balanceETH = await provider.getBalance(wallet)
    // 如果钱包ETH足够
    if(ethers.formatEther(balanceETH) > 0.0015){

        // 2. 调用desposit()函数，将0.001 ETH转为WETH
        console.log("\n2. 调用desposit()函数，存入0.001 ETH")
        // 编码calldata
        const param2 = contractWETH.interface.encodeFunctionData(
            "deposit"          
            );
        console.log(`编码结果： ${param2}`)
        // 创建交易
        const tx2 = {
            to: addressWETH,
            data: param2,
            value: ethers.parseEther("0.001")}
        // 发起交易，写入操作需要 wallet.sendTransaction(tx)
        const receipt1 = await wallet.sendTransaction(tx2)
        // 等待交易上链
        await receipt1.wait()
        console.log(`交易详情：`)
        console.log(receipt1)
        const balanceWETH_deposit = await contractWETH.balanceOf(address)
        console.log(`存款后WETH持仓: ${ethers.formatEther(balanceWETH_deposit)}\n`)

    }else{
        // 如果ETH不足
        console.log("ETH不足，去水龙头领一些Goerli ETH")
        console.log("1. chainlink水龙头: https://faucets.chain.link/goerli")
        console.log("2. paradigm水龙头: https://faucet.paradigm.xyz/")
    }
}

main()
```
---

## 批量生成钱包
```js
import { ethers } from "ethers";

// 1. 创建HD钱包
console.log("\n1. 创建HD钱包")
// 生成随机助记词
const mnemonic = ethers.Mnemonic.entropyToPhrase(ethers.randomBytes(32))
// 创建HD钱包
const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic)
console.log(hdNode);

// 2. 通过HD钱包派生20个钱包
console.log("\n2. 通过HD钱包派生20个钱包")
const numWallet = 20
// 派生路径：m / purpose' / coin_type' / account' / change / address_index
// 我们只需要切换最后一位address_index，就可以从hdNode派生出新钱包
let basePath = "m/44'/60'/0'/0";
let wallets = [];
for (let i = 0; i < numWallet; i++) {
    let hdNodeNew = hdNode.derivePath(basePath + "/" + i);
    let walletNew = new ethers.Wallet(hdNodeNew.privateKey);
    console.log(`第${i+1}个钱包地址： ${walletNew.address}`)
    wallets.push(walletNew);
}

// 3. 保存钱包（加密json）
console.log("\n3. 保存钱包（加密json）")
const wallet = ethers.Wallet.fromPhrase(mnemonic)
console.log("通过助记词创建钱包：")
console.log(wallet)
// 加密json用的密码，可以更改成别的
const pwd = "password"
const json = await wallet.encrypt(pwd)
console.log("钱包的加密json：")
console.log(json)

// 4. 从加密json读取钱包
const wallet2 = await ethers.Wallet.fromEncryptedJson(json, pwd);
console.log("\n4. 从加密json读取钱包：")
console.log(wallet2)

```
---

## 批量转账
```js
import { ethers } from "ethers";

// 1. 创建HD钱包
console.log("\n1. 创建HD钱包")
// 通过助记词生成HD钱包
const mnemonic = `air organ twist rule prison symptom jazz cheap rather dizzy verb glare jeans orbit weapon universe require tired sing casino business anxiety seminar hunt`
const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic)
console.log(hdNode);

// 2. 获得20个钱包的地址
console.log("\n2. 通过HD钱包派生20个钱包")
const numWallet = 20
// 派生路径：m / purpose' / coin_type' / account' / change / address_index
// 我们只需要切换最后一位address_index，就可以从hdNode派生出新钱包
let basePath = "m/44'/60'/0'/0";
let addresses = [];
for (let i = 0; i < numWallet; i++) {
    let hdNodeNew = hdNode.derivePath(basePath + "/" + i);
    let walletNew = new ethers.Wallet(hdNodeNew.privateKey);
    addresses.push(walletNew.address);
}
console.log(addresses)
const amounts = Array(20).fill(ethers.parseEther("0.0001"))
console.log(`发送数额：${amounts}`)

// 3. 创建provider和wallet，发送代币用
//准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// 利用私钥和provider创建wallet对象
// 如果这个钱包没goerli测试网ETH了
// 请使用自己的小号钱包测试，钱包地址: 0x338f8891D6BdC58eEB4754352459cC461EfD2a5E ,请不要给此地址发送任何ETH
// 注意不要把自己的私钥上传到github上
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)

// 4. 声明Airdrop合约
// Airdrop的ABI
const abiAirdrop = [
    "function multiTransferToken(address,address[],uint256[]) external",
    "function multiTransferETH(address[],uint256[]) public payable",
];
// Airdrop合约地址（Goerli测试网）
const addressAirdrop = '0x71C2aD976210264ff0468d43b198FD69772A25fa' // Airdrop Contract
// 声明Airdrop合约
const contractAirdrop = new ethers.Contract(addressAirdrop, abiAirdrop, wallet)

// 5. 声明WETH合约
// WETH的ABI
const abiWETH = [
    "function balanceOf(address) public view returns(uint)",
    "function transfer(address, uint) public returns (bool)",
    "function approve(address, uint256) public returns (bool)"
];
// WETH合约地址（Goerli测试网）
const addressWETH = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6' // WETH Contract
// 声明WETH合约
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)


const main = async () => {

    // 6. 读取一个地址的ETH和WETH余额
    console.log("\n3. 读取一个地址的ETH和WETH余额")
    //读取WETH余额
    const balanceWETH = await contractWETH.balanceOf(addresses[10])
    console.log(`WETH持仓: ${ethers.formatEther(balanceWETH)}\n`)
    //读取ETH余额
    const balanceETH = await provider.getBalance(addresses[10])
    console.log(`ETH持仓: ${ethers.formatEther(balanceETH)}\n`)

    const myETH = await provider.getBalance(wallet)
    const myToken = await contractWETH.balanceOf(wallet.getAddress())
    // 如果钱包ETH足够和WETH足够
    if(ethers.formatEther(myETH) > 0.002 && ethers.formatEther(myToken) >= 0.002){

        // 7. 调用multiTransferETH()函数，给每个钱包转 0.0001 ETH
        console.log("\n4. 调用multiTransferETH()函数，给每个钱包转 0.0001 ETH")
        // 发起交易
        const tx = await contractAirdrop.multiTransferETH(addresses, amounts, {value: ethers.parseEther("0.002")})
        // 等待交易上链
        await tx.wait()
        // console.log(`交易详情：`)
        // console.log(tx)
        const balanceETH2 = await provider.getBalance(addresses[10])
        console.log(`发送后该钱包ETH持仓: ${ethers.formatEther(balanceETH2)}\n`)
        
        // 8. 调用multiTransferToken()函数，给每个钱包转 0.0001 WETH
        console.log("\n5. 调用multiTransferToken()函数，给每个钱包转 0.0001 WETH")
        // 先approve WETH给Airdrop合约
        const txApprove = await contractWETH.approve(addressAirdrop, ethers.parseEther("1"))
        await txApprove.wait()
        // 发起交易
        const tx2 = await contractAirdrop.multiTransferToken(addressWETH, addresses, amounts)
        // 等待交易上链
        await tx2.wait()
        // console.log(`交易详情：`)
        // console.log(tx2)
        // 读取WETH余额
        const balanceWETH2 = await contractWETH.balanceOf(addresses[10])
        console.log(`发送后该钱包WETH持仓: ${ethers.formatEther(balanceWETH2)}\n`)

    }else{
        // 如果ETH和WETH不足
        console.log("ETH不足，请使用自己的小号钱包测试，并兑换一些WETH")
        console.log("1. chainlink水龙头: https://faucets.chain.link/goerli")
        console.log("2. paradigm水龙头: https://faucet.paradigm.xyz/")
    }
}

main()

```
---

## 批量归集
```js
import { ethers } from "ethers";

// 1. 创建provider和wallet，发送代币用
// 准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);
// 利用私钥和provider创建wallet对象
const privateKey = '0x21ac72b6ce19661adf31ef0d2bf8c3fcad003deee3dc1a1a64f5fa3d6b049c06'
const wallet = new ethers.Wallet(privateKey, provider)

// 2. 声明WETH合约
// WETH的ABI
const abiWETH = [
    "function balanceOf(address) public view returns(uint)",
    "function transfer(address, uint) public returns (bool)",
];
// WETH合约地址（Goerli测试网）
const addressWETH = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6' // WETH Contract
// 声明WETH合约
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)

// 3. 创建HD钱包
console.log("\n1. 创建HD钱包")
// 通过助记词生成HD钱包
const mnemonic = `air organ twist rule prison symptom jazz cheap rather dizzy verb glare jeans orbit weapon universe require tired sing casino business anxiety seminar hunt`
const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic)
console.log(hdNode);

// 4. 获得20个钱包
console.log("\n2. 通过HD钱包派生20个钱包")
const numWallet = 20
// 派生路径：m / purpose' / coin_type' / account' / change / address_index
// 我们只需要切换最后一位address_index，就可以从hdNode派生出新钱包
let basePath = "m/44'/60'/0'/0";
let wallets = [];
for (let i = 0; i < numWallet; i++) {
    let hdNodeNew = hdNode.derivePath(basePath + "/" + i);
    let walletNew = new ethers.Wallet(hdNodeNew.privateKey);
    wallets.push(walletNew);
    console.log(walletNew.address)
}
// 定义发送数额
const amount = ethers.parseEther("0.0001")
console.log(`发送数额：${amount}`)


const main = async () => {
    // 5. 读取一个地址的ETH和WETH余额
    console.log("\n3. 读取一个地址的ETH和WETH余额")
    //读取WETH余额
    const balanceWETH = await contractWETH.balanceOf(wallets[19])
    console.log(`WETH持仓: ${ethers.formatEther(balanceWETH)}`)
    //读取ETH余额
    const balanceETH = await provider.getBalance(wallets[19])
    console.log(`ETH持仓: ${ethers.formatEther(balanceETH)}\n`)

    // 如果钱包ETH足够
    if(ethers.formatEther(balanceETH) > ethers.formatEther(amount) &&
    ethers.formatEther(balanceWETH) >= ethers.formatEther(amount)){

        // 6. 批量归集钱包的ETH
        console.log("\n4. 批量归集20个钱包的ETH")
        const txSendETH = {
            to: wallet.address,
            value: amount
        }
        for (let i = 0; i < numWallet; i++) {
            // 将钱包连接到provider
            let walletiWithProvider = wallets[i].connect(provider)
            var tx = await walletiWithProvider.sendTransaction(txSendETH)
            console.log(`第 ${i+1} 个钱包 ${walletiWithProvider.address} ETH 归集开始`)
        }
        await tx.wait()
        console.log(`ETH 归集结束`)

        // 7. 批量归集钱包的WETH
        console.log("\n5. 批量归集20个钱包的WETH")
        for (let i = 0; i < numWallet; i++) {
            // 将钱包连接到provider
            let walletiWithProvider = wallets[i].connect(provider)
            // 将合约连接到新的钱包
            let contractConnected = contractWETH.connect(walletiWithProvider)
            var tx = await contractConnected.transfer(wallet.address, amount)
            console.log(`第 ${i+1} 个钱包 ${wallets[i].address} WETH 归集开始`)
        }
        await tx.wait()
        console.log(`WETH 归集结束`)

        // 8. 读取一个地址在归集后的ETH和WETH余额
        console.log("\n6. 读取一个地址在归集后的ETH和WETH余额")
        // 读取WETH余额
        const balanceWETHAfter = await contractWETH.balanceOf(wallets[19])
        console.log(`归集后WETH持仓: ${ethers.formatEther(balanceWETHAfter)}`)
        // 读取ETH余额
        const balanceETHAfter = await provider.getBalance(wallets[19])
        console.log(`归集后ETH持仓: ${ethers.formatEther(balanceETHAfter)}\n`)
    }
}

main()

```
---

## MerkleTree脚本
```js
import { ethers } from "ethers";
import { MerkleTree } from "merkletreejs";
import * as contractJson from "./contract.json" assert {type: "json"};

// 1. 生成merkle tree
console.log("\n1. 生成merkle tree")
// 白名单地址
const tokens = [
    "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", 
    "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"
];
// leaf, merkletree, proof
const leaf       = tokens.map(x => ethers.keccak256(x))
const merkletree = new MerkleTree(leaf, ethers.keccak256, { sortPairs: true });
const proof      = merkletree.getHexProof(leaf[0]);
const root = merkletree.getHexRoot()
console.log("Leaf:")
console.log(leaf)
console.log("\nMerkleTree:")
console.log(merkletree.toString())
console.log("\nProof:")
console.log(proof)
console.log("\nRoot:")
console.log(root)

// 2. 创建provider和wallet
// 准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);
// 利用私钥和provider创建wallet对象
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)

// 3. 创建合约工厂
// NFT的人类可读abi
const abiNFT = [
    "constructor(string memory name, string memory symbol, bytes32 merkleroot)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function mint(address account, uint256 tokenId, bytes32[] calldata proof) external",
    "function ownerOf(uint256) view returns (address)",
    "function balanceOf(address) view returns (uint256)",
];
// 合约字节码，在remix中，你可以在两个地方找到Bytecode
// i. 部署面板的Bytecode按钮
// ii. 文件面板artifact文件夹下与合约同名的json文件中
// 里面"object"字段对应的数据就是Bytecode，挺长的，608060起始
// "object": "608060405260646000553480156100...
const bytecodeNFT = contractJson.default.object;
const factoryNFT = new ethers.ContractFactory(abiNFT, bytecodeNFT, wallet);

const main = async () => {
    // 读取钱包内ETH余额
    const balanceETH = await provider.getBalance(wallet)

    // 如果钱包ETH足够
    if(ethers.formatEther(balanceETH) > 0.002){
        // 4. 利用contractFactory部署NFT合约
        console.log("\n2. 利用contractFactory部署NFT合约")
        // 部署合约，填入constructor的参数
        const contractNFT = await factoryNFT.deploy("WTF Merkle Tree", "WTF", root)
        console.log(`合约地址: ${contractNFT.target}`);
        console.log("等待合约部署上链")
        await contractNFT.waitForDeployment()
        // 也可以用 contractNFT.deployTransaction.wait()
        console.log("合约已上链")

        // 5. 调用mint()函数，利用merkle tree验证白名单，给第0个地址铸造NFT
        console.log("\n3. 调用mint()函数，利用merkle tree验证白名单，给第一个地址铸造NFT")
        console.log(`NFT名称: ${await contractNFT.name()}`)
        console.log(`NFT代号: ${await contractNFT.symbol()}`)
        let tx = await contractNFT.mint(tokens[0], "0", proof)
        console.log("铸造中，等待交易上链")
        await tx.wait()
        console.log(`mint成功，地址${tokens[0]} 的NFT余额: ${await contractNFT.balanceOf(tokens[0])}\n`)

    }else{
        // 如果ETH不足
        console.log("ETH不足，去水龙头领一些Goerli ETH")
        console.log("1. alchemy水龙头: https://goerlifaucet.com/")
        console.log("2. paradigm水龙头: https://faucet.paradigm.xyz/")
    }
}

main()

```
---

## 数字签名脚本
```js
// 通过签名分发NFT白名单流程：
//    
//    在服务器保管signer钱包的私钥-公钥对
// -> 在服务器记录allowlist（白名单地址）和tokenId，并生成对应的msgHash，
// -> 用signer钱包给msgHash签名
// -> 部署NFT合约，初始化时signer的公钥保存在合约中。
// -> 用户mint时填地址和tokenId，并向服务器请求签名。
// -> 调用合约的mint()函数进行铸造

import { ethers } from "ethers";
import * as contractJson from "./contract.json" assert {type: "json"};

// 1. 创建provider和wallet
// 准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);
// 利用私钥和provider创建wallet对象
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)

// 2. 根据allowlist地址和tokenId生成msgHash，并签名
console.log("\n1. 生成签名")
// 创建消息
const account = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
const tokenId = "0"
// 等效于Solidity中的keccak256(abi.encodePacked(account, tokenId))
const msgHash = ethers.solidityPackedKeccak256(
    ['address', 'uint256'],
    [account, tokenId])
console.log(`msgHash：${msgHash}`)

const main = async () => {
    // 签名
    const messageHashBytes = ethers.getBytes(msgHash)
    const signature = await wallet.signMessage(messageHashBytes);
    console.log(`签名：${signature}`)

    // 3. 创建合约工厂
    // NFT的人类可读abi
    const abiNFT = [
        "constructor(string memory _name, string memory _symbol, address _signer)",
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function mint(address _account, uint256 _tokenId, bytes memory _signature) external",
        "function ownerOf(uint256) view returns (address)",
        "function balanceOf(address) view returns (uint256)",
    ];
    // 合约字节码，在remix中，你可以在两个地方找到Bytecode
    // i. 部署面板的Bytecode按钮
    // ii. 文件面板artifact文件夹下与合约同名的json文件中
    // 里面"object"字段对应的数据就是Bytecode，挺长的，608060起始
    // "object": "608060405260646000553480156100...
    const bytecodeNFT = contractJson.default.object;
    const factoryNFT = new ethers.ContractFactory(abiNFT, bytecodeNFT, wallet);

    // 读取钱包内ETH余额
    const balanceETH = await provider.getBalance(wallet)

    // 如果钱包ETH足够
    if(ethers.formatEther(balanceETH) > 0.002){
        // 4. 利用contractFactory部署NFT合约
        console.log("\n2. 利用contractFactory部署NFT合约")
        // 部署合约，填入constructor的参数
        const contractNFT = await factoryNFT.deploy("WTF Signature", "WTF", wallet.address)
        console.log(`合约地址: ${contractNFT.target}`);
        console.log("等待合约部署上链")
        await contractNFT.waitForDeployment()
        // 也可以用 contractNFT.deployTransaction.wait()
        console.log("合约已上链")

        // 5. 调用mint()函数，利用签名验证白名单，给account地址铸造NFT
        console.log("\n3. 调用mint()函数，利用签名验证白名单，给第一个地址铸造NFT")
        console.log(`NFT名称: ${await contractNFT.name()}`)
        console.log(`NFT代号: ${await contractNFT.symbol()}`)
        let tx = await contractNFT.mint(account, tokenId, signature)
        console.log("铸造中，等待交易上链")
        await tx.wait()
        console.log(`mint成功，地址${account} 的NFT余额: ${await contractNFT.balanceOf(account)}\n`)

    }else{
        // 如果ETH不足
        console.log("ETH不足，去水龙头领一些Goerli ETH")
        console.log("1. chainlink水龙头: https://faucets.chain.link/goerli")
        console.log("2. paradigm水龙头: https://faucet.paradigm.xyz/")
    }
}

main()
```
---

## 监听Mempool
```js
// provider.on("pending", listener)
import { ethers } from "ethers";

// 1. 创建provider和wallet，监听事件时候推荐用wss连接而不是http
console.log("\n1. 连接 wss RPC")
// 准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_MAINNET_WSSURL = 'wss://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
const provider = new ethers.WebSocketProvider(ALCHEMY_MAINNET_WSSURL);
let network = provider.getNetwork()
// network.then(res => console.log(`[${(new Date).toLocaleTimeString()}] 连接到 chain ID ${res.chainId}`));

console.log("\n2. 限制调用rpc接口速率")
// 2. 限制访问rpc速率，不然调用频率会超出限制，报错。
function throttle(fn, delay) {
    let timer;
    return function(){
        if(!timer) {
            fn.apply(this, arguments)
            timer = setTimeout(()=>{
                clearTimeout(timer)
                timer = null
            },delay)
        }
    }
}

const main = async () => {
    let i = 0;
    // 3. 监听pending交易，获取txHash
    console.log("\n3. 监听pending交易，打印txHash。")
    provider.on("pending", async (txHash) => {
        if (txHash && i < 100) {
            // 打印txHash
            console.log(`[${(new Date).toLocaleTimeString()}] 监听Pending交易 ${i}: ${txHash} \r`);
            i++
            }
    });

    // 4. 监听pending交易，并获取交易详情
    console.log("\n4. 监听pending交易，获取txHash，并输出交易详情。")
    let j = 0
    provider.on("pending", throttle(async (txHash) => {
        if (txHash && j <= 100) {
            // 获取tx详情
            let tx = await provider.getTransaction(txHash);
            console.log(`\n[${(new Date).toLocaleTimeString()}] 监听Pending交易 ${j}: ${txHash} \r`);
            console.log(tx);
            j++
            }
    }, 1000));
};

main()

```
---

## 解码交易详情
```js
// provider.on("pending", listener)
import { ethers } from "ethers";

// 1. 创建provider和wallet，监听事件时候推荐用wss连接而不是http
// 准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_MAINNET_WSSURL = 'wss://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
const provider = new ethers.WebSocketProvider(ALCHEMY_MAINNET_WSSURL);
let network = provider.getNetwork()
network.then(res => console.log(`[${(new Date).toLocaleTimeString()}] 连接到 chain ID ${res.chainId}`));

// 2. 创建interface对象，用于解码交易详情。
const iface = new ethers.Interface([
    "function transfer(address, uint) public returns (bool)",
])

// 3. 限制访问rpc速率，不然调用频率会超出限制，报错。
function throttle(fn, delay) {
    let timer;
    return function(){
        if(!timer) {
            fn.apply(this, arguments)
            timer = setTimeout(()=>{
                clearTimeout(timer)
                timer = null
            },delay)
        }
    }
}

const main = async () => {
    // 4. 监听pending的erc20 transfer交易，获取交易详情，然后解码。
    console.log("\n4. 监听pending交易，获取txHash，并输出交易详情。")
    provider.on("pending", throttle(async (txHash) => {
        if (txHash) {
            // 获取tx详情
            let tx = await provider.getTransaction(txHash);
            if (tx) {
                // filter pendingTx.data
                if (tx.data.indexOf(iface.getFunction("transfer").selector) !== -1) {
                    // 打印txHash
                    console.log(`\n[${(new Date).toLocaleTimeString()}] 监听Pending交易: ${txHash} \r`);

                    // 打印解码的交易详情
                    let parsedTx = iface.parseTransaction(tx)
                    console.log("pending交易详情解码：")
                    console.log(parsedTx);
                    // Input data解码
                    console.log("Input Data解码：")
                    console.log(parsedTx.args);
                }
            }
        }
    }, 100));
};

main()

```
---

## 靓号生成器
```js
// 正则表达式，
// ^0x之后跟前几位要匹配的字符
// .*为通配符
// $之前写最后几位要匹配的字符
// 例子：首位两个0，末尾两个1 
// const regex = /^0x00.*11$/

import { ethers } from "ethers";
var wallet // 钱包
const regex = /^0x000.*$/ // 表达式
var isValid = false
while(!isValid){
    wallet = ethers.Wallet.createRandom() // 随机生成钱包，安全
    isValid = regex.test(wallet.address) // 检验正则表达式
    //console.log(wallet.address)
}
// 打印靓号地址与私钥
console.log(`\n靓号地址：${wallet.address}`)
console.log(`靓号私钥：${wallet.privateKey}\n`)



```
---

## 读取任意数据
```js
import { ethers } from "ethers";

//准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// 目标合约地址: Arbitrum ERC20 bridge（主网）
const addressBridge = '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a' // DAI Contract
// 合约所有者 slot
const slot = `0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103`

const main = async () => {
    console.log("开始读取特定slot的数据")
    const privateData = await provider.getStorage(addressBridge, slot)
    console.log("读出的数据（owner地址）: ", ethers.getAddress(ethers.dataSlice(privateData, 12)))
}

main()
```
---

## 抢先交易脚本
```js
import { ethers } from "ethers";

// 1. 创建provider
var url = "ws://127.0.0.1:8545";
const provider = new ethers.WebSocketProvider(url);
let network = provider.getNetwork()
network.then(res => console.log(`[${(new Date).toLocaleTimeString()}] 连接到 chain ID ${res.chainId}`));

// 2. 创建interface对象，用于解码交易详情。
const iface = new ethers.Interface([
    "function mint() external",
])

// 3. 创建钱包，用于发送抢跑交易
const privateKey = '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a'
const wallet = new ethers.Wallet(privateKey, provider)

const main = async () => {
    // 4. 监听pending交易，获取txHash，输出交易详情，发送抢跑交易。
    console.log("\n4. 监听pending交易，获取txHash，输出交易详情，发送抢跑交易。")
    provider.on("pending", async (txHash) => {
        if (txHash) {
            // 获取tx详情
            let tx = await provider.getTransaction(txHash);
            if (tx) {
                // filter pendingTx.data
                if (tx.data.indexOf(iface.getFunction("mint").selector) !== -1 && tx.from != wallet.address ) {
                    // 打印txHash
                    console.log(`\n[${(new Date).toLocaleTimeString()}] 监听Pending交易: ${txHash} \r`);

                    // 打印原始交易
                    console.log("raw transaction")
                    console.log(tx);
                    
                    // 打印交易解码后结果
                    let parsedTx = iface.parseTransaction(tx)
                    console.log("pending交易详情解码：")
                    console.log(parsedTx);

                    // 构建抢跑tx
                    const txFrontrun = {
                        to: tx.to,
                        value: tx.value,
                        maxPriorityFeePerGas: tx.maxPriorityFeePerGas * 2n,
                        maxFeePerGas: tx.maxFeePerGas * 2n,
                        gasLimit: tx.gasLimit * 2n,
                        data: tx.data
                    }
                    // 发送抢跑交易
                    var txResponse = await wallet.sendTransaction(txFrontrun)
                    console.log(`正在frontrun交易`)
                    await txResponse.wait()
                    console.log(`frontrun 交易成功`)                
                }
            }
        }
    });
};

main()
```
---

## 识别ERC20合约
```js
import { ethers } from "ethers";

// 1. 准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// 2. 合约地址
// DAI address (mainnet)
const daiAddr = "0x6b175474e89094c44da98b954eedeac495271d0f"
// BAYC address (mainnet)
const baycAddr = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"

// 3. 检查函数，检查某个地址是否为ERC20合约
async function erc20Checker(addr){
    // 获取合约bytecode
    let code = await provider.getCode(addr)
    // 非合约地址的bytecode是0x
    if(code != "0x"){
        // 检查bytecode中是否包含transfer和totalSupply函数的selector
        if(code.includes("a9059cbb") && code.includes("18160ddd")){
            // 如果有，则是ERC20
            return true
        }else{
            // 如果没有，则不是ERC20
            return false
        }
    }else{
        return null;
    }

}

const main = async () => {
    // 检查DAI合约是否为ERC20
    let isDaiERC20 = await erc20Checker(daiAddr)
    console.log(`1. Is DAI a ERC20 contract: ${isDaiERC20}`)

    // 检查BAYC合约是否为ERC20
    let isBaycERC20 = await erc20Checker(baycAddr)
    console.log(`2. Is BAYC a ERC20 contract: ${isBaycERC20}`)
}

main()
```
---

## Falshbots
```js
import { ethers } from "ethers";
import {
    FlashbotsBundleProvider,
    FlashbotsBundleResolution,
  } from "@flashbots/ethers-provider-bundle";
  
const GWEI = 10n ** 9n;
const CHAIN_ID = 5; // goerli测试网，如果用主网，chainid 改为 1

// 1. 普通rpc （非flashbots rpc）
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// 2. flashbots声誉私钥，用于建立“声誉”，详情见: https://docs.flashbots.net/flashbots-auction/searchers/advanced/reputation
// !!!注意: 这个账户，不要储存资金，也不是flashbots主私钥。
const authKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2c'
const authSigner = new ethers.Wallet(authKey, provider)

const main = async () => {

    // 3. flashbots rpc（goerli 测试网），用于发送交易
    const flashbotsProvider = await FlashbotsBundleProvider.create(
        provider,
        authSigner,
        // 使用主网 Flashbots，需要把下面两行删去
        'https://relay-goerli.flashbots.net/', 
        'goerli'
        );
    
    // 4. 创建一笔交易
    // 交易: 发送0.001 ETH测试币到 WTF Academy 地址
    const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2c'
    const wallet = new ethers.Wallet(privateKey, provider)
    // EIP 1559 transaction
    const transaction0 = {
    chainId: CHAIN_ID,
    type: 2,
    to: "0x25df6DA2f4e5C178DdFF45038378C0b08E0Bce54",
    value: ethers.utils.parseEther("0.001"),
    maxFeePerGas: GWEI * 100n
    }

    // 5. 创建交易 Bundle
    const transactionBundle = [
        {
            signer: wallet, // ethers signer
            transaction: transaction0 // ethers populated transaction object
        }
        // 也可以加入mempool中签名好的交易（可以是任何人发送的）
        // ,{
        //     signedTransaction: SIGNED_ORACLE_UPDATE_FROM_PENDING_POOL // serialized signed transaction hex
        // }
    ]

    // 6. 模拟交易，交易模拟成功后才能执行
    // 签名交易
    const signedTransactions = await flashbotsProvider.signBundle(transactionBundle)
    // 设置交易的目标执行区块（在哪个区块执行）
    const targetBlockNumber = (await provider.getBlockNumber()) + 1
    // 模拟
    const simulation = await flashbotsProvider.simulate(signedTransactions, targetBlockNumber)
    // 检查模拟是否成功
    if ("error" in simulation) {
        console.log(`模拟交易出错: ${simulation.error.message}`);
    } else {
        console.log(`模拟交易成功`);
        console.log(JSON.stringify(simulation, null, 2))
    }

    // 7. 发送交易上链
    // 因为测试网Flashbots的节点很少，需要尝试很多次才能成功上链，这里我们循环发送 100 个区块。
    for (let i = 1; i <= 100; i++) {
        let targetBlockNumberNew = targetBlockNumber + i - 1;
        // 发送交易
        const res = await flashbotsProvider.sendRawBundle(signedTransactions, targetBlockNumberNew);
        if ("error" in res) {
        throw new Error(res.error.message);
        }
        // 检查交易是否上链
        const bundleResolution = await res.wait();
        // 交易有三个状态: 成功上链/没有上链/Nonce过高。
        if (bundleResolution === FlashbotsBundleResolution.BundleIncluded) {
        console.log(`恭喜, 交易成功上链，区块: ${targetBlockNumberNew}`);
        console.log(JSON.stringify(res, null, 2));
        process.exit(0);
        } else if (
        bundleResolution === FlashbotsBundleResolution.BlockPassedWithoutInclusion
        ) {
        console.log(`请重试, 交易没有被纳入区块: ${targetBlockNumberNew}`);
        } else if (
        bundleResolution === FlashbotsBundleResolution.AccountNonceTooHigh
        ) {
        console.log("Nonce 太高，请重新设置");
        process.exit(1);
        }
    }
}

main()
```
---

## EIP712签名脚本
```js
import { ethers } from "ethers";

// 利用Alchemy的rpc节点连接以太坊网络
// 准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// 利用私钥和provider创建wallet对象
const privateKey = '0x503f38a9c967ed597e47fe25643985f032b072db8075426a92110f82df48dfcb'
const wallet = new ethers.Wallet(privateKey, provider)

// 创建 EIP712 Domain
let contractName = "EIP712Storage"
let version = "1"
let chainId = "1"
let contractAddress = "0xf8e81D47203A594245E36C48e151709F0C19fBe8"

const domain = {
    name: contractName,
    version: version,
    chainId: chainId,
    verifyingContract: contractAddress,
};

// 创建类型化数据，Storage
let spender = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
let number = "100"

const types = {
    Storage: [
        { name: "spender", type: "address" },
        { name: "number", type: "uint256" },
    ],
};

const message = {
    spender: spender,
    number: number,
};

const main = async () => {
    console.log("Message: ", message)
    // EIP712 签名
    const signature = await wallet.signTypedData(domain, types, message);
    console.log("Signature:", signature);
    // 验证 EIP712 签名，从签名和消息复原出 signer 地址
    let eip712Signer = ethers.verifyTypedData(domain, types, message, signature)
    console.log("EIP712 Signer: ", eip712Signer)
}

main();
```