const path = require('path')
const webpackMerge = require('webpack-merge').default
const { VueLoaderPlugin } = require('vue-loader/dist/index')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

// 基础公共配置
const baseConfig = {
  mode: process.env.NODE_ENV,
  entry: {
    index: path.join(__dirname, 'src/index.js'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
      {
        test: /\.(css|less)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  externals: {
    vue: 'window.Vue',
  },
}

// 开发环境配置
if (process.env.NODE_ENV === 'development') {
  config = webpackMerge(baseConfig, {
    devtool: 'inline-cheap-module-source-map',
    devServer: { static: { directory: path.join(__dirname) }, compress: true, port: 6001, hot: false, compress: false },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Hello Vue',
        filename: 'index.html',
        template: './index.html',
        minify: false,
        inject: false,
        templateParameters: {
          publicPath: path.join(__dirname),
          js: ['./node_modules/vue/dist/vue.runtime.global.js', './index.js'],
          css: ['./index.css'],
        },
      }),
    ],
  })
}
// 生产环境配置
else {
  config = webpackMerge(baseConfig, {
    optimization: { minimizer: [new TerserPlugin({}), new CssMinimizerPlugin({})] },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Hello Vue',
        filename: 'index.html',
        template: './index.html',
        minify: false,
        inject: false,
        templateParameters: {
          publicPath: path.join(__dirname),
          js: ['https://unpkg.com/vue@3.2.37/dist/vue.runtime.global.js', './index.js'],
          css: ['./index.css'],
        },
      }),
    ],
  })
}

module.exports = config
