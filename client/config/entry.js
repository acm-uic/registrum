/*
 * File: /config/entry.js
 * File Created: Wednesday, 11th December 2019 11:15:00 pm
 * Author: Alex Chomiak
 *
 * Last Modified: Monday, 23rd December 2019 1:55:57 pm
 * Modified By: Alex Chomiak
 *
 * Author Github: https://github.com/alexchomiak
 */

// * This file has the same settings for all 3 webpack configs (i.e. entry points and alias paths)

const settings = require('./settings')
const path = require('path')

// * Build alias paths
let alias = {}
for (let _alias in settings.aliases) {
    alias[_alias] = path.resolve(__dirname, `../src/${settings.aliases[_alias][0]}`)
}

module.exports = {
    mode: 'production',
    entry: ['@babel/polyfill', path.resolve(__dirname, '../src/index.tsx')],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', 'jsx'],
        alias
    }
}
