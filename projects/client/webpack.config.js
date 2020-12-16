/* eslint-disable @typescript-eslint/no-var-requires */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin, HotModuleReplacementPlugin } = require('webpack');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const { InjectManifest } = require('workbox-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

// * Get git information through GitRevisionPlugin
const gitRevisionPlugin = new GitRevisionPlugin({ branch: true });

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const config = {
  entry: './src/index.tsx',
  mode,
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: ['file-loader']
      },
      {
        test: /\.svg$/,
        loader: 'react-svg-loader'
      }
    ]
  },
  resolve: { extensions: ['*', '.js', '.jsx', '.ts', '.tsx'] },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'bundle.[contenthash].js'
  },
  devServer: {
    historyApiFallback: true,
    port: 3000,
    hotOnly: true,
    proxy: {
      '/api': 'http://localhost:4000/'
    }
  },
  devtool: mode === 'development' ? 'inline-source-map' : undefined,
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new DefinePlugin({
      VERSION: JSON.stringify(gitRevisionPlugin.version()),
      COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
      BRANCH: JSON.stringify(gitRevisionPlugin.branch())
    }),
    new HtmlWebpackPlugin({
      title: 'Registrum',
      favicon: 'src/images/favicon.ico'
    }),
    new WebpackPwaManifest({
      short_name: 'Registrum',
      name: 'Registrum: Class Tracker',
      description: 'Registrum Class Tracker',
      lang: 'en-US',
      start_url: '.',
      display: 'fullscreen',
      theme_color: '#d90000',
      background_color: '#ffffff',
      crossorigin: 'use-credentials',
      icons: [
        {
          src: path.resolve('src/images/logo.png'),
          sizes: [120, 152, 167, 180, 1024],
          destination: path.join('icons', 'ios'),
          ios: true
        },
        {
          src: path.resolve('src/images/logo.png'),
          size: 1024,
          destination: path.join('icons', 'ios'),
          ios: 'startup'
        },
        {
          src: path.resolve('src/images/logo.png'),
          sizes: [36, 48, 72, 96, 144, 192, 512],
          destination: path.join('icons', 'android')
        }
      ]
    }),
    new HotModuleReplacementPlugin(),
    new Dotenv({
      defaults: true,
      systemvars: true,
      silent: true
    }),
    new InjectManifest({
      swSrc: './src/service-worker.ts',
      swDest: 'service-worker.js',
      maximumFileSizeToCacheInBytes: 100 * 1024 * 1024
    })
  ]
};

module.exports = config;
