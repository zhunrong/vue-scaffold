const fs = require('fs/promises');
const fsExtra = require('fs-extra');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * 检查目录是否为空
 * @param {string} dir
 * @returns
 */
async function isDirEmpty(dir) {
  const result = await fs.readdir(dir);
  return result.length === 0;
}

/**
 * 判断项目名是否有效
 * @param {string} name
 * @returns
 */
function isProjectNameValid(name) {
  return /^[a-zA-Z](-?[a-zA-Z0-9]+)*$/.test(name);
}

/**
 * 允许项目修改 webpack 配置
 * @param {any} webpackConf
 * @param {string} type
 */
function applyScaffoldConfig(webpackConf, type) {
  const moduleId = path.join(process.cwd(), 'scaffold.config.js');
  let hook;
  try {
    hook = require(moduleId);
  } catch (error) {
    //
  }
  if (typeof hook === 'function') {
    hook(webpackConf, type);
  }
}

function parsePackageJson() {
  const moduleId = path.join(process.cwd(), 'package.json');
  let json = {};
  try {
    json = require(moduleId);
  } catch (error) {
    //
  }
  return json;
}

function useHtmlWebpackPlugin() {
  const package = parsePackageJson();
  const templatePath = path.join(process.cwd(),'public/index.html');
  return new HtmlWebpackPlugin({
    title: package.name || '@chenzr/vue-scaffold',
    template: fsExtra.pathExistsSync(templatePath) ? templatePath : null,
  });
}

module.exports = {
  isDirEmpty,
  isProjectNameValid,
  applyScaffoldConfig,
  parsePackageJson,
  useHtmlWebpackPlugin
};
