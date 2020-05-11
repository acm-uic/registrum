module.exports = {
    collectCoverage: true,
    coverageDirectory: './coverage/',
    coverageDirectory: './coverage/',
    setupFiles: ['<rootDir>/src/test/test-setup.js'],
    testMatch: ['<rootDir>/src/test/*.test.(ts|tsx|js)'],
    modulePaths: ['<rootDir>'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        '\\.(css|less)$': 'identity-obj-proxy'
    },
    transform: {
        '^.+\\.tsx?$': 'babel-jest',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/src/fileTransformer.js'
    }
}
