const path = require("path")
const NodemonPlugin = require("nodemon-webpack-plugin")

module.exports = {
  entry: path.resolve(__dirname, "src", "index.js"),
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  target: "node",
  mode: "development",
  experiments: {
    asyncWebAssembly: true,
  },
  externals: {
    bufferutil: 'commonjs bufferutil',
    'utf-8-validate': 'commonjs utf-8-validate',
  },
  plugins: [
    new NodemonPlugin(),
  ]
}