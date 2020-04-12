/*
 * File: /scripts/refresh.js
 * File Created: Thursday, 12th December 2019 2:07:47 am
 * Author: Alex Chomiak
 *
 * Last Modified: Sunday, 5th January 2020 1:17:33 am
 * Modified By: Alex Chomiak
 *
 * Author Github: https://github.com/alexchomiak
 */

const config = require( '../config/tsconfig' )
require( 'fs' ).writeFileSync(
    './tsconfig.json',
    // eslint-disable-next-line
    `// * Automatically Generated tsconfig file\n// * Change settings in settings/tsconfig.js\n ${config}`
)
console.log( 'tsconfig.json refreshed!' )
