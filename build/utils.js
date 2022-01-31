const fs = require('fs/promises');

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

module.exports = {
  isDirEmpty,
  isProjectNameValid
};