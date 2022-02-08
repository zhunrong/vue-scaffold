const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const fsExtra = require('fs-extra');
const path = require('path');
const { createDevConf, createProdConf, createLibConf } = require('./webpack-config');
const { isDirEmpty, isProjectNameValid, applyScaffoldConfig } = require('./utils');
const _ = require('lodash');

const dev = async () => {
  const webpackConf = createDevConf();
  applyScaffoldConfig(webpackConf, 'dev');
  const compiler = webpack(webpackConf);
  const devServer = {
    ...webpackConf.devServer
  };
  const server = new WebpackDevServer(devServer, compiler);

  await server.start();
};

const build = async (options) => {
  const webpackConf = createProdConf(options);
  applyScaffoldConfig(webpackConf, 'build');
  const compiler = webpack(webpackConf);
  compiler.run((err, stats) => {
    if (err) {
      throw err;
    }
    console.log(stats.toString(webpackConf.stats));
  });
};

const buildLib = async (options) => {
  const webpackConf = createLibConf(options);
  applyScaffoldConfig(webpackConf, 'lib');
  const compiler = webpack(webpackConf);
  compiler.run((err, stats) => {
    if (err) {
      throw err;
    }
    console.log(stats.toString(webpackConf.stats));
  });
};

const createProject = async (dir) => {
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
  const version = require('../package.json').version;
  const packageJson = {
    'name': projectName,
    'version': '0.1.0',
    'main': 'index.js',
    'license': 'MIT',
    'files': [
      'libs',
      'types'
    ],
    'devDependencies': {
      '@chenzr/vue-scaffold': `^${version}`
    }
  };
  await fsExtra.outputFile(path.resolve(targetDir, 'package.json'), JSON.stringify(packageJson, null, 2));
  console.log(`创建完成：${projectName}:0.1.0`);
};

module.exports = {
  dev,
  build,
  buildLib,
  createProject
};
