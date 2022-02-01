const { program } = require('commander');
const { dev, buildLib, createProject } = require('./service');

program.version(require('../package.json').version);

program
  .command('create <dir>')
  .description('创建一个项目')
  .action(async (dir) => {
    createProject(dir);
  });

program
  .command('dev')
  .description('启动本地开发服务器')
  .action(async () => {
    await dev();
  });

program
  .command('build')
  .description('打包示例文件')
  .action(() => {
    console.log('打包示例文件');
  });

program
  .command('lib')
  .option('--name <name>', '库的名称(output.library.name)', 'index')
  .description('打包组件库')
  .action((options) => {
    buildLib(options);
  });

program.parse();