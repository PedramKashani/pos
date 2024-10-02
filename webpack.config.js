const path = require('path');

module.exports = {
  entry: "./index.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },

  mode: "development",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  devServer: {
    static: path.resolve(__dirname, "dist"),
    compress: true,
    port: 5432,
  },
};