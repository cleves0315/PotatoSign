process.env.NODE_ENV = 'production';
process.env.BABEL_ENV = 'production';

const Webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const webpackConfig = require('../webpack.config.js');

webpackConfig.optimization = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      extractComments: false,
    }),
  ],
};

delete webpackConfig.chromeExtensionBoilerplate;

Webpack(webpackConfig, function (err) {
  if (err) throw err;
});
