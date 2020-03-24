/*
 * File: /config/webpack.development.config.js
 * File Created: Wednesday, 11th December 2019 11:06:04 pm
 * Author: Alex Chomiak
 *
 * Last Modified: Sunday, 5th January 2020 3:14:44 pm
 * Modified By: Alex Chomiak
 *
 * Author Github: https://github.com/alexchomiak
 */

// * Refresh tsconfig
require('../scripts/refresh')
const path = require('path')
const settings = require('./settings')
const production = require('./webpack.production.config')

module.exports = {
    ...production,
    mode: 'development',
    devServer: {
        contentBase: path.resolve(__dirname, `../public/`),
        port: settings.port,
        hot: true,
        before: function(app) {
            app.use(function(req, res, next) {
                console.log(`>>>> ${req.url}`)
                next()
            })
        },
        watchContentBase: true,
        compress: true,
        historyApiFallback: true,
        overlay: true,
        host: '0.0.0.0',
        proxy: {
            '/api': {
                target: settings.apiProxyUrl,
                secure: false
            }
        }
    },
    plugins: [...production.plugins]
}
