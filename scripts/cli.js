const { program } = require('commander');
const { dev, build, buildLib, createProject } = require('./service');

program.version(require('../package.json').version);

program
  .command('create <dir>')
  .description('创建一个项目')
  .option('--template <name>', '指定创建模板', 'project')
  .action(async (dir, options) => {
    await createProject(dir, options);
  });

program
  .command('dev')
  .description('启动本地开发服务器')
  .option('--port <port>', '监听端口', '8080')
  .option('--publicPath <publicPath>', '公共路径', '/')
  .option('--entry <path>', '指定入口文件路径', 'dev/main.ts')
  .action(async (options) => {
    await dev(options);
  });

program
  .command('build')
  .description('打包 dev 目录代码')
  .option('--dest <dir>', '打包输出目录', 'docs')
  .option('--publicPath <publicPath>', '公共路径', '/')
  .option('--entry <path>', '指定入口文件路径', 'dev/main.ts')
  .option('--analyze', '打包分析', false)
  .action(async (options) => {
    await build(options);
  });

program
  .command('lib')
  .description('打包组件代码（package 目录）')
  .option('--name <name>', '库的名称(output.library.name)', 'index')
  .option('--entry <path>', '指定入口文件路径', 'package/index.ts')
  .option('--analyze', '打包分析', false)
  .action(async (options) => {
    await buildLib(options);
  });

program.parse();
