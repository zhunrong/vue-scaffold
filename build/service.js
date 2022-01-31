const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { merge } = require('webpack-merge');
const fsExtra = require('fs-extra');
const path = require('path');
const { devConf, createLibConf } = require('./webpack-config');
const { isDirEmpty, isProjectNameValid } = require('./utils');
const _ = require('lodash');

exports.dev = async () => {
  const webpackConf = merge({}, devConf, {});
  const compiler = webpack(webpackConf);
  const devServer = {
    ...webpackConf.devServer
  };
  const server = new WebpackDevServer(devServer, compiler);

  await server.start();
}

exports.build = async () => { }

exports.buildLib = async (options) => {
  const webpackConf = createLibConf(options);
  const compiler = webpack(webpackConf);
  compiler.run((err, stats) => {
    if (err) {
      throw err;
    }
    console.log(stats.toString({
      assets: true,
      modules: false,
      colors: true
    }));
  });
}

exports.createProject = async (dir) => {
  const currentDir = process.cwd();
  let targetDir = '';
  let projectName = '';
  if (dir === '.') {
    if (!await isDirEmpty(currentDir)) {
      console.log('当前目录不是空目录！');
      return;
    }
    projectName = currentDir.split(path.sep).pop();
    if (!isProjectNameValid(projectName)) {
      console.log(`项目名无效：${dir}`);
      return;
    }
    targetDir = currentDir;
  } else {
    if (!isProjectNameValid(dir)) {
      console.log(`项目名无效：${dir}`);
      return;
    }
    projectName = _.kebabCase(dir);
    targetDir = path.resolve(currentDir, dir);
    if (fsExtra.pathExistsSync(targetDir)) {
      console.log(`目录已存在：${targetDir}`);
      return;
    }
  }
  await fsExtra.copy(path.resolve(__dirname, '../boilerplate'), targetDir);
  const packageJson = {
    "name": projectName,
    "version": "0.1.0",
    "main": "index.js",
    "license": "MIT",
    "files": [
      "libs",
      "types"
    ],
    "devDependencies": {
      "@chenzr/vue-scaffold": require('../package.json').version
    }
  };
  await fsExtra.outputFile(path.resolve(targetDir, 'package.json'), JSON.stringify(packageJson, null, 2));
  console.log(`创建完成：${projectName}:0.1.0`);
}