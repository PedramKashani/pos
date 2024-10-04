const path = require("path");

module.exports = {
  entry: "./frontend/src/index.js", // Frontend entry point
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js", // Output file
    publicPath: '/',
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"], // Add .jsx to resolve imports
  },
  devServer: {
    static: path.join(__dirname, "frontend/public"), // Serve files from this directory
    compress: true,
    port: 8080,
    historyApiFallback: true,
  },
};
