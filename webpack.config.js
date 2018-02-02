const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: ["babel-polyfill", "./index.js"],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  context: path.resolve(__dirname, "src"),
  devServer: {
    stats: "verbose",
    open: true,
    port: 3000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /src/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env"]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    })
  ]
};
