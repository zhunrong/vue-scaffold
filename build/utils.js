const fs = require('fs/promises');
const path = require('path');

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

module.exports = {
  isDirEmpty,
  isProjectNameValid,
  applyScaffoldConfig
};