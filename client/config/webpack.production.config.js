/*
 * File: /config/webpack.production.config.js
 * File Created: Wednesday, 11th December 2019 11:13:23 pm
 * Author: Alex Chomiak
 *
 * Last Modified: Thursday, 12th December 2019 8:27:11 pm
 * Modified By: Alex Chomiak 
 *
 * Author Github: https://github.com/alexchomiak
 */

// * Refresh tsconfig
require('../scripts/refresh')

const path = require('path')
const settings = require('./settings')
const CopyPlugin = require('copy-webpack-plugin')
const modules = require('./modules')
const webpack = require('webpack')
const env = require('./environment')
const banner = require('./banner')
const entry = require('./entry')
module.exports = {
    ...entry,
    output: {
        path: path.resolve(__dirname, `../${settings.bundleDirectory}`),
        filename: `${settings.bundleName}.js`
    },
    plugins: [
        new CopyPlugin([
            {
                from: 'public/',
                to: './',
                ignore: ['*.js']
            }
        ]),
        new webpack.DefinePlugin(env),
        banner
    ],
    module: modules
}
