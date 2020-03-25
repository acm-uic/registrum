/*
 * File: /config/tsconfig.js
 * File Created: Thursday, 12th December 2019 2:05:06 am
 * Author: Alex Chomiak
 *
 * Last Modified: Monday, 23rd December 2019 10:55:03 am
 * Modified By: Alex Chomiak 
 *
 * Author Github: https://github.com/alexchomiak
 */

// !!!!!! MODIFY TSCONFIG HERE!!!
// * * Upon changing run the command:
// ! npm run refresh to replace the tsconfig in the root of the project
// * This allows for the aliases in the settings to be ported into a tsconfig file without manual copying
// * (Yes, I'm that lazy)

const settings = require('./settings')

// * Retrieve Alias Paths for tsconfig
let paths = {}
for (let p in settings.aliases) {
    paths[`${p}/*`] = [`${settings.aliases[p][0]}/*`]
}

// * This will refresh the typescript config with the updated values
const config = {
    compilerOptions: {
        paths: {
            ...paths
        },
        target: 'esnext',
        outDir: './public/',
        strictNullChecks: false,
        moduleResolution: 'node',
        allowJs: true,
        noEmit: true,
        strict: true,
        esModuleInterop: true,
        jsx: 'react',
        baseUrl: 'src',
        lib: ['es2015', 'dom.iterable', 'es2016.array.include', 'es2017.object', 'dom'],
        module: 'es6',
        removeComments: true,
        alwaysStrict: true,
        allowUnreachableCode: false,
        noImplicitAny: true,
        noImplicitThis: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,
        forceConsistentCasingInFileNames: true,
        importHelpers: true
    }
}

// * Export Stringified JSON File
module.exports = JSON.stringify(config)
