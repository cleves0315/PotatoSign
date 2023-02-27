const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// import { Configuration } from "webpack";
const Webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");

const devServerOptions = {
  // https: false,
  hot: false,
  open: true,
  // liveReload: true,
  // watchFiles: ["src/**/*"],
  client: { progress: true },
  // path: 'chrome-extension://piolmgkcmbpnckniidjclpkecikbgcdh',
  // host: "chrome-extension://piolmgkcmbpnckniidjclpkecikbgcdh",
  // port: process.env.PORT,
  static: {
    watch: true,
    directory: path.join(__dirname, "./dist"),
  },
  devMiddleware: {
    // publicPath: `chrome://`,
    // serverSideRender: true,
    writeToDisk: true,
  },
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
  allowedHosts: "all",
  webSocketServer: "ws",
};

const config = {
  // production | development
  mode: "development",
  entry: {
    background: "./src/background/index.ts",
    "content-script": "./src/content-script/index.ts",
  },
  devServer: devServerOptions,
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  resolve: {
    extensions: [".js", ".ts", ".scss"],
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: { transpileOnly: true },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          // {
          //   loader: "css-loader",
          //   options: {
          //     modules: {
          //       localIdentHashSalt: "hash",
          //     },
          //   },
          // },
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        path.resolve(__dirname, "src/manifest.json"),
        path.resolve(__dirname, "src/assets"),
      ],
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({ extractComments: false })],
  },
};

const compiler = Webpack(config);
// compiler.run();
const server = new WebpackDevServer(devServerOptions, compiler);

server.start();
