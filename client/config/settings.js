/*
 * File: /config/settings.js
 * File Created: Wednesday, 11th December 2019 11:06:13 pm
 * Author: Alex Chomiak
 *
 * Last Modified: Friday, 3rd January 2020 2:23:38 pm
 * Modified By: Alex Chomiak 
 *
 * Author Github: https://github.com/alexchomiak
 */

module.exports = {
    // * build settings
    bundleName: 'bundle',
    bundleDirectory: 'build',
    // * library settings
    libraryDirectory: 'lib',
    libraryFileName: 'library',
    libraryName: 'Library',
    includeReactInBundle: false,
    includeReduxInBundle: false,
    // * Dev server settings
    port: 3001,
    apiProxyUrl: process.env.API_PROXY_URL || 'https://localhost:4000'
}
