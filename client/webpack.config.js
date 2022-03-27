const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './bootstrap.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bootstrap.js',
    clean: true,
  },
  mode: 'development',
  plugins: [
    new CopyWebpackPlugin(['index.html', 'index.css']),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 8080,
  },
  experiments: {
    asyncWebAssembly: true,
  }
};
