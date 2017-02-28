var path = require('path');
var webpack = require('webpack');

module.exports = {
  // target: 'node',
  node: {
    fs: "empty"
  },
  entry: path.join(__dirname, '/client/src/index.js'),

  output: {
    path: path.join(__dirname, '/client/dist/'),
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: [{loader: 'eslint-loader'}],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {presets: [['es2015', {modules: false}]]},
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': Object.keys(process.env).reduce(function(o, k) {
        o[k] = JSON.stringify(process.env[k]);
        return o;
      }, {})
    }),
    new webpack.DefinePlugin({ "global.GENTLY": false })
  ]
};
