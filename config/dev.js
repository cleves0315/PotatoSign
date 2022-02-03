process.env.PORT = '3000';
process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = 'development';

const path = require('path');
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.config.js');

const devServerOptions = {
  https: false,
  hot: false,
  client: false,
  host: 'localhost',
  port: process.env.PORT,
  static: {
    directory: path.join(__dirname, '../dist'),
  },
  devMiddleware: {
    publicPath: `http://localhost:${process.env.PORT}/`,
    writeToDisk: true,
  },
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  allowedHosts: 'all',
};

const options = webpackConfig.chromeExtensionBoilerplate || {};
const excludeEntriesToHotReload = options.notHotReload || [];

for (var entryName in webpackConfig.entry) {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
    webpackConfig.entry[entryName] = [
      'webpack/hot/dev-server',
      `webpack-dev-server/client?hot=true&hostname=localhost&port=${process.env.PORT}`,
    ].concat(webpackConfig.entry[entryName]);
  }
}

webpackConfig.plugins = [new Webpack.HotModuleReplacementPlugin()].concat(
  webpackConfig.plugins || []
);

delete webpackConfig.chromeExtensionBoilerplate;

const compiler = Webpack({
  ...webpackConfig,
  devtool: 'cheap-module-source-map',
});

const server = new WebpackDevServer(devServerOptions, compiler);
const runServer = async () => {
  console.log('Starting server...');
  await server.start();
};

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept();
}

runServer();
