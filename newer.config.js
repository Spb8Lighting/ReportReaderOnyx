const webpack = require('webpack')
const path = require('path')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssets = require('optimize-css-assets-webpack-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
const IsDev = (process.env.NODE_ENV === 'development')

const config = {
  mode: process.env.NODE_ENV,
  entry: {
    app: ['./src/index.js', './assets/stylesheets/styles.scss', './assets/images/M1.svg', './assets/images/M-Touch.svg', './assets/images/M-Play.svg', './assets/images/Onyx-Report-Reader.svg', './assets/images/close.svg', './assets/images/settings.svg', './assets/images/changelog.svg', './assets/images/question.svg', './src/html/index.html', './src/manifest.json']
  },
  output: {
    path: path.resolve(__dirname, './public'),
    filename: './[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loaders: [{
          loader: 'file-loader',
          options: {
            name: './img/[name].[ext]'
          }
        },
        'img-loader']
      },
      {
        test: /\.json$/,
        type: 'javascript/auto',
        loaders: [{
          loader: 'file-loader',
          options: {
            name: './[name].[ext]'
          }
        }]
      },
      {
        test: /\.(html?)$/,
        loaders: [{
          loader: 'file-loader',
          options: {
            name: './[name].[ext]'
          }
        }]
      },
      {
        test: /\.(woff2?|ttf)$/,
        loaders: [{
          loader: IsDev ? 'url-loader' : 'file-loader',
          options: {
            name: './fonts/[name].[ext]'
          }
        }]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: ['css-hot-loader'].concat(ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader', 'postcss-loader']
        }))
      }
    ]
  },
  plugins: [],
  devtool: IsDev ? 'eval-source-map' : '',
  devServer: {
    contentBase: path.resolve(__dirname, './public'),
    historyApiFallback: true,
    inline: true,
    open: false,
    hot: true
  }
}

if (!IsDev) {
  config.plugins.push(
    new ExtractTextWebpackPlugin('app.css'),
    new UglifyJSPlugin(),
    new OptimizeCSSAssets(),
    new CleanWebpackPlugin({
      verbose: true,
      dry: false
    }),
    new CopyWebpackPlugin([{ from: './assets/favicons', to: './img/favicons' }]),
    new WorkboxPlugin.GenerateSW({ skipWaiting: true })
  )
} else {
  config.plugins.push(
    new ExtractTextWebpackPlugin('app.css'),
    new DashboardPlugin(),
    new WorkboxPlugin.GenerateSW({ skipWaiting: true }),
    new webpack.HotModuleReplacementPlugin()
  )
}

module.exports = config
