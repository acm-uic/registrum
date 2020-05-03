module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                shippedProposals: true,
                corejs: {
                    version: 3,
                    proposals: true
                },
                targets: {
                    browsers: ['last 2 versions']
                }
            }
        ],
        ['@babel/preset-react'],
        ['@babel/preset-typescript']
    ],
    plugins: [
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-class-properties',
        '@babel/proposal-object-rest-spread'
    ]
}
