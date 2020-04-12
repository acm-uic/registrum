/*
 * File: /config/webpack.library.config.js
 * File Created: Wednesday, 11th December 2019 11:13:30 pm
 * Author: Alex Chomiak
 *
 * Last Modified: Friday, 3rd January 2020 2:17:45 pm
 * Modified By: Alex Chomiak
 *
 * Author Github: https://github.com/alexchomiak
 */

// * Refresh tsconfig
require('../scripts/refresh')

const path = require('path')
const settings = require('./settings')
const modules = require('./modules')
const webpack = require('webpack')
const env = require('./environment')
const banner = require('./banner')
const entry = require('./entry')

//********  excludes libraries from bundle file, decreases file size
let externals = {}
if (!settings.includeReactInBundle) {
    externals['react'] = 'React'
    externals['react-dom'] = 'ReactDOM'
    externals['react-router'] = 'ReactRouter'
    externals['react-redux'] = 'react-redux'
}
if (!settings.includeReduxInBundle) {
    externals['redux'] = 'Redux'
}
// ********

module.exports = {
    ...entry,
    entry: ['@babel/polyfill', path.resolve(__dirname, '../src/library.ts')],
    output: {
        path: path.resolve(__dirname, `../${settings.libraryDirectory}`),
        filename: `${settings.libraryFileName}.js`,
        library: settings.libraryName,
        libraryTarget: 'umd',
        auxiliaryComment: 'Alex Chomiak webpack configuration. https://github.com/alexchomiak'
    },
    optimization: {
        minimize: true
    },
    externals,
    module: modules,
    plugins: [new webpack.DefinePlugin(env), banner]
}
