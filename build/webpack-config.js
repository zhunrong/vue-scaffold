const path = require('path');
const webpack = require('webpack');
const { merge, mergeWithRules } = require('webpack-merge');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const _ = require('lodash');
const { parsePackageJson } = require('./utils');
const ESLintPlugin = require('eslint-webpack-plugin');

function createBaseConf() {
  const package = parsePackageJson();
  return {
    resolve: {
      extensions: ['.ts', '.tsx', '...'],
      alias: {
        '@package': path.join(process.cwd(), 'package/index.ts'),
      },
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            },
          ],
        },
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            },
            {
              loader: 'ts-loader',
              options: {
                appendTsSuffixTo: [/\.vue$/],
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.tsx$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            },
            {
              loader: 'ts-loader',
              options: {
                appendTsxSuffixTo: [/\.vue$/],
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: ['vue-style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.css$/,
          use: ['vue-style-loader', 'css-loader'],
        },
        {
          test: /\.vue$/,
          use: ['vue-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new ESLintPlugin({
        extensions: ['js', 'jsx', 'ts', 'tsx', 'vue'],
      }),
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        'process.env.VERSION': JSON.stringify(package.version),
      }),
    ],
    stats: {
      assets: true,
      modules: false,
      colors: true,
    },
  };
}

function createDevConf() {
  const package = parsePackageJson();
  return merge(createBaseConf(), {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: path.join(process.cwd(), 'dev/main.ts'),
    output: {
      filename: '[name].bundle.js',
      path: path.join(process.cwd(), 'dist'),
      clean: true,
    },
    devServer: {
      port: 8080,
      historyApiFallback: true,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
      static: {
        directory: path.join(process.cwd(), 'public'),
        publicPath: '/public',
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: package.name || '@chenzr/vue-scaffold',
        template: path.resolve(__dirname, 'template.ejs'),
      }),
    ],
  });
}

function createProdConf(options) {
  const {dest} = options;
  const package = parsePackageJson();
  const outputDest = path.join(process.cwd(), dest);
  return merge(createBaseConf(), {
    mode: 'production',
    entry: path.join(process.cwd(), 'dev/main.ts'),
    output: {
      filename: 'js/[name].[contenthash:8].js',
      chunkFilename: 'js/[name].[contenthash:8].js',
      assetModuleFilename: 'asset/[name].[contenthash:8][ext]',
      path: outputDest,
      clean: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: package.name || '@chenzr/vue-scaffold',
        template: path.resolve(__dirname, 'template.ejs'),
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(process.cwd(), 'public'),
            to: path.join(outputDest, 'public'),
          },
        ],
      }),
    ],
  });
}

const customMerge = mergeWithRules({
  module: {
    rules: {
      test: 'match',
      use: 'replace',
    },
  },
});

function createLibConf({ name }) {
  const entryName = _.kebabCase(name);
  return customMerge(createBaseConf(), {
    mode: 'development',
    devtool: 'source-map',
    entry: {
      [entryName]: path.join(process.cwd(), 'package/index.ts'),
    },
    output: {
      filename: '[name].umd.js',
      path: path.join(process.cwd(), 'libs'),
      clean: true,
      library: {
        name,
        type: 'umd',
      },
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
      ],
    },
    plugins: [new MiniCssExtractPlugin()],
    externals: {
      vue: 'vue',
    },
  });
}

module.exports = {
  createDevConf,
  createProdConf,
  createLibConf,
};
