# Web3js 扩展RPC插件

1、首先将 web3.js 添加为项目 package.json 中的对等依赖项，并为您的插件创建一个 TypeScript 类。该类应扩展 web3.js 提供的 Web3Plugin 类。

```js
import { Web3PluginBase } from 'web3';

export default class CustomRpcMethodsPlugin extends Web3PluginBase {
    // step 1
    // ...
}
```

2、添加公共 pluginNamespace 属性

```js
import { Web3PluginBase } from 'web3';

export default class CustomRpcMethodsPlugin extends Web3PluginBase {
    public pluginNamespace = 'customRpcMethods'; // step 2
}
```

3、添加新的 RPC 方法

```js
import { Web3PluginBase } from 'web3';

export default class CustomRpcMethodsPlugin extends Web3PluginBase {
    public pluginNamespace = 'customRpcMethods';

    public async customRpcMethod() {
        // step 3
        return this.requestManager.send({
            // plugin has access to web3.js internal features like request manager
            method: 'custom_rpc_method',
            params: [],
        });
    }
}
```

4、允许您访问 web3 对象上的插件

```js
import { Web3PluginBase } from 'web3';

export default class CustomRpcMethodsPlugin extends Web3PluginBase {
    public pluginNamespace = 'customRpcMethods';

    public async customRpcMethod() {
        return this.requestManager.send({
            // plugin has access to web3.js internal features like request manager
            method: 'custom_rpc_method',
            params: [],
        });
    }
}

// Module Augmentation
declare module 'web3' {
    // step 4

    interface Web3Context {
        customRpcMethods: CustomRpcMethodsPlugin;
    }
}
```

完成后发布到NPM包管理中心

5、使用 Web3 自定义 PRC 插件

```js
import { Web3 } from 'web3';
import CustomRpcMethodsPlugin from 'web3-plugin-example';

const web3 = new Web3('http://127.0.0.1:8545');
web3.registerPlugin(new CustomRpcMethodsPlugin()); // step 5

web3.customRpcMethods.customRpcMethod();
```