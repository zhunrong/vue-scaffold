const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { merge } = require('webpack-merge');
const { devConf, createLibConf } = require('./webpack-config');

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