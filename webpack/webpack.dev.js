const common = require("./webpack.common");
const merge = require("webpack-merge");

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: "html-loader",
          options: { minimize: false }
        }
      }
    ]
  }
});