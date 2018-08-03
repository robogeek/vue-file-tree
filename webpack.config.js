const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    'VueFileTree': './src/vue-file-tree.vue'
  },
  output: {
    path: __dirname + '/dist',
    filename: 'vue-file-tree.js',
    library: 'VueFileTree',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },

  devtool: 'sourcemap',


  resolve: {
    extensions: [ '.js' , '.json' ],
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },

  externals: {
    'Vue': 'vue'
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: '../'
            }
          },
          "css-loader"
        ]
      },
      {
        test: /\.html$/,
        use: 'vue-html-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          esModule: true,
          transformToRequire: {
            video: 'src',
            source: 'src'
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg|mp4|ico|wav)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: '[name]-[hash].[ext]',
          outputPath: 'media/',
          publicPath: 'bundles/media/'
        }
      },
      // Handles custom fonts. Currently used for icons.
      {
        test: /\.woff$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/',
          publicPath: 'bundles/fonts/'
        }
      }
    ]
  },

  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/*.css', to: '[name].css'},
      { from: 'src/*.d.ts', to: '[name].ts'}
    ]),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};
