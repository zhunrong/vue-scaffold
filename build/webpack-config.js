const path = require('path');
const { merge, mergeWithRules } = require('webpack-merge');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const _ = require('lodash');

const baseConf = {
  resolve: {
    extensions: ['.ts', '.tsx', '...'],
    alias: {
      '@package': path.join(process.cwd(), 'package/index.ts')
    }
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}

const devConf = merge({}, baseConf, {
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
    static: path.join(process.cwd(), 'public')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'template.ejs')
    })
  ]
})

exports.devConf = devConf;

const prodConf = merge({}, baseConf, {})

exports.prodConf = prodConf;

const customMerge = mergeWithRules({
  module: {
    rules: {
      test: "match",
      use: 'replace',
    },
  }
});

exports.createLibConf = ({ name }) => {
  const entryName = _.kebabCase(name);
  return customMerge({}, baseConf, {
    mode: 'development',
    devtool: 'source-map',
    entry: {
      [entryName]: path.join(process.cwd(), 'package/index.ts')
    },
    output: {
      filename: '[name].umd.js',
      path: path.join(process.cwd(), 'libs'),
      clean: true,
      library: {
        name,
        type: 'umd'
      }
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
      ]
    },
    plugins: [
      new MiniCssExtractPlugin()
    ],
    externals: {
      vue: 'vue',
      '@juggle/resize-observer': '@juggle/resize-observer'
    }
  });
};