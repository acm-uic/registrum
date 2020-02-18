/*
 * File: /config/banner.js
 * File Created: Wednesday, 23rd October 2019 10:24:47 pm
 * Author: Alex Chomiak
 *
 * Last Modified: Wednesday, 11th December 2019 11:16:05 pm
 * Modified By: Alex Chomiak
 *
 * Author Github: https://github.com/alexchomiak
 */

const webpack = require('webpack')
const os = require('os')
module.exports = new webpack.BannerPlugin(
    [
        '---------------------------------------------',
        '                    Dream',
        '                    Team',
        '                 Final Project',
        '---------------------------------------------'
    ].join('\n')
)
