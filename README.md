# vue 组件开发脚手架

> 注：自用！！！

### 安装

```bash
yarn global add @chenzr/vue-scaffold
```

### 命令

### 创建新项目

```bash
scaffold create <dir>
```

### 启动开发服务器

```bash
scaffold dev
```

| 参数                        | 说明     | 默认值 |
| --------------------------- | ------- | ------ |
| --port \<port\>             | 监听端口 | 8080   |
| --publicPath \<publicPath\> | 公共路径 | /      |

### 构建

> 构建入口为 dev/main.ts

```bash
scaffold build
```

| 参数                        | 说明     | 默认值 |
| --------------------------- | ------- | ------ |
| --dest \<dir\>              | 输出目录 | docs   |
| --publicPath \<publicPath\> | 公共路径 | /      |
| --analyze                   | 打包分析 | false  |

### 打包组件

> 构建入口为 package/index.ts

```bash
scaffold lib
```

| 参数                        | 说明     | 默认值 |
| --------------------------- | ------- | ------ |
| --name \<name\>             | 库的名称 | index  |
| --analyze                   | 打包分析 | false  |