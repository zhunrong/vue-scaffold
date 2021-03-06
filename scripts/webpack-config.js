const path = require('path');
const webpack = require('webpack');
const { merge, mergeWithRules } = require('webpack-merge');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const _ = require('lodash');
const { parsePackageJson, useHtmlWebpackPlugin } = require('./utils');
const ESLintPlugin = require('eslint-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const BASE_OPTIONS = {
  publicPath: '/',
};

function createBaseConf(options) {
  options = Object.assign({}, BASE_OPTIONS, options);
  const package = parsePackageJson();
  // css-loader options
  const cssLoaderOptions = {
    modules: {
      mode: 'global',
      localIdentName: '[local]__[hash:base64:8]',
      exportLocalsConvention: 'camelCaseOnly',
    },
  };
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
          use: [
            'vue-style-loader',
            {
              loader: 'css-loader',
              options: cssLoaderOptions,
            },
            'postcss-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.less$/,
          use: [
            'vue-style-loader',
            {
              loader: 'css-loader',
              options: cssLoaderOptions,
            },
            'postcss-loader',
            'less-loader',
          ],
        },
        {
          test: /\.css$/,
          use: ['vue-style-loader', 'css-loader'],
        },
        {
          test: /\.vue$/,
          use: ['cache-loader', 'vue-loader'],
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
      new webpack.ProgressPlugin(),
      new ESLintPlugin({
        extensions: ['js', 'jsx', 'ts', 'tsx', 'vue'],
      }),
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        'process.env.VERSION': JSON.stringify(package.version),
        'process.env.PUBLIC_PATH': JSON.stringify(options.publicPath),
      }),
    ],
    stats: {
      assets: true,
      modules: false,
      colors: true,
    },
  };
}

function createDevConf(options) {
  return merge(createBaseConf(options), {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: path.join(process.cwd(), options.entry),
    output: {
      filename: '[name].bundle.js',
      path: path.join(process.cwd(), 'dist'),
      clean: true,
      publicPath: options.publicPath || '/',
    },
    devServer: {
      port: options.port || '8080',
      historyApiFallback: true,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
      static: {
        directory: path.join(process.cwd(), 'public'),
        publicPath: options.publicPath || '/',
      },
    },
    plugins: [useHtmlWebpackPlugin()],
    cache: {
      type: 'filesystem',
    },
  });
}

function createProdConf(options) {
  const { dest, analyze } = options;
  const outputDest = path.join(process.cwd(), dest);
  const publicDir = path.join(process.cwd(), 'public');
  const plugins = [
    useHtmlWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '**/*',
          context: publicDir,
          filter: (filepath) =>
            path.resolve(filepath) !== path.join(publicDir, 'index.html'),
        },
      ],
    }),
  ];
  // ????????????
  if (analyze) {
    plugins.push(new BundleAnalyzerPlugin());
  }
  return merge(createBaseConf(options), {
    mode: 'production',
    entry: path.join(process.cwd(), options.entry),
    output: {
      publicPath: options.publicPath || '/',
      filename: 'js/[name].[contenthash:8].js',
      chunkFilename: 'js/[name].[contenthash:8].js',
      assetModuleFilename: 'asset/[name].[contenthash:8][ext]',
      path: outputDest,
      clean: true,
    },
    plugins,
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

function createLibConf({ name, analyze, entry }) {
  const entryName = _.kebabCase(name);
  const plugins = [new MiniCssExtractPlugin()];
  // ????????????
  if (analyze) {
    plugins.push(new BundleAnalyzerPlugin());
  }
  return customMerge(createBaseConf(), {
    mode: 'development',
    devtool: 'source-map',
    entry: {
      [entryName]: path.join(process.cwd(), entry),
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
    plugins,
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
