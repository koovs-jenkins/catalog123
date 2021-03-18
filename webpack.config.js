const path = require("path");
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
var CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: ["@babel/polyfill", "./src/index.js"],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: {
           presets: ["@babel/env"] ,
           "plugins": [
            ["@babel/plugin-proposal-decorators", { "legacy": true }],
          ],
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: "[name]__[local]__[hash:base64:5]"
            }
          },

          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: () => [
                autoprefixer({
                  browsers: ["> 1%", "last 2 versions"]
                })
              ]
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        loader: "url-loader?limit=1000000&name=images/[name].[ext]"
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
    alias: { "react-dom": "@hot-loader/react-dom" }
  },
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/dist/",
    filename: "bundle.js"
  },
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: path.join(__dirname, "public/"),
    port: 4000,
    publicPath: "http://localhost:4000/dist/",
    hotOnly: true,
    historyApiFallback: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: { level: 9 },
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false,
      })
  
  ]
};
