const { program } = require('commander');
const { dev, build, buildLib, createProject } = require('./service');

program.version(require('../package.json').version);

program
  .command('create <dir>')
  .description('创建一个项目')
  .action(async (dir) => {
    await createProject(dir);
  });

program
  .command('dev')
  .description('启动本地开发服务器')
  .option('--port <port>', '监听端口', '8080')
  .option('--publicPath <publicPath>', '公共路径', '/')
  .action(async (options) => {
    await dev(options);
  });

program
  .command('build')
  .description('打包 dev 目录代码')
  .option('--dest <dir>', '打包输出目录', 'docs')
  .option('--publicPath <publicPath>', '公共路径', '/')
  .action(async (options) => {
    await build(options);
  });

program
  .command('lib')
  .description('打包组件代码（package 目录）')
  .option('--name <name>', '库的名称(output.library.name)', 'index')
  .action(async (options) => {
    await buildLib(options);
  });

program.parse();
