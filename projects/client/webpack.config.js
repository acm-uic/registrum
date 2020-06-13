const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.tsx',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/i,
                exclude: /(node_modules)/,
                loader: "babel-loader",
                options: { presets: ["@babel/preset-env"] }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: ['file-loader'],
            },
            {
                test: /\.svg$/,
                loader: 'react-svg-loader'
            }
        ]
    },
    resolve: { extensions: ["*", ".js", ".jsx", ".ts", ".tsx"] },
    output: {
        path: path.resolve(__dirname, 'dist/'),
        publicPath: '/dist/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'public/'),
        historyApiFallback: true,
        port: 3000,
        publicPath: 'http://localhost:3000/dist/',
        hotOnly: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}