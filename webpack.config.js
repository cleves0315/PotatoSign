const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  // production | development
  mode: "production",

  entry: {
    background: "./src/background/index.js",
    "content-script": "./src/content-script/index.js",
  },

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },

  module: {
    rules: [
      // {
      //   test: /\.(png|svg|jpg|jpeg|gif)$/i,
      //   type: "asset/resource",
      // },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  plugins: [
    new CopyPlugin({
      patterns: [{ from: path.resolve(__dirname, "src/assets") }],
    }),
  ],
};
