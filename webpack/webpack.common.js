const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: path.join(__dirname, '../src/com/sketch.js'),
  output: {
    path: path.resolve(path.join(__dirname, '../'), 'dist'),
    filename: 'main-[contenthash].js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new WebpackCleanupPlugin(),
    new MiniCssExtractPlugin({ filename: "[name].[hash].css" })
  ]
}