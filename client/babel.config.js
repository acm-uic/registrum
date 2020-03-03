module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage'
            }
        ],
        ['@babel/preset-react'],
        ['@babel/preset-typescript']
    ],
    plugins: ['@babel/plugin-proposal-class-properties']
}
