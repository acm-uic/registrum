module.exports = {
    collectCoverage: true,
    coverageDirectory: './coverage/',
    coverageDirectory: './coverage/',
    setupFiles: ['<rootDir>/src/test/test-setup.js'],
    testMatch: ['<rootDir>/src/test/*.test.(ts|tsx|js)'],
    modulePaths: ['<rootDir>'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        '\\.(css|less)$': 'identity-obj-proxy',
        '^@utils(.*)$': '<rootDir>/src/utils$1',
        '^@redux(.*)$': '<rootDir>/src/models/store$1',
        '^@components(.*)$': '<rootDir>/src/components$1',
        '^@styles(.*)$': '<rootDir>/src/styles$1',
        '^@assets(.*)$': '<rootDir>/src/assets$1',
        '^@interfaces(.*)$': '<rootDir>/src/models/interfaces$1',
        '^@pages(.*)$': '<rootDir>/src/pages$1'
    },
    transform: {
        '^.+\\.tsx?$': 'babel-jest',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/src/fileTransformer.js'
    }
}
